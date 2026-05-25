import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2, MessageSquareText, Send, Sparkles, ArrowLeft, Bot, ShieldAlert, Timer } from "lucide-react";
import {
  getInterviewResult,
  getNextInterviewQuestion,
  normalizeInterviewQuestion,
  normalizeInterviewResult,
  startInterview,
  submitInterviewAnswer,
} from "../../utilities/api/interviewApi";

const InterviewSessionPage = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const disclaimerKey = useMemo(
    () => `interview_disclaimer_${applicationId || "unknown"}`,
    [applicationId],
  );

  const applicationMeta = useMemo(
    () => ({
      applicationId: location.state?.applicationId || applicationId,
      jobTitle: location.state?.jobTitle || "Your selected job",
      companyName: location.state?.companyName || "Searchera employer",
      jobLocation: location.state?.jobLocation || "Location unavailable",
      jobSalary: location.state?.jobSalary || "Salary not provided",
    }),
    [applicationId, location.state],
  );

  const [sessionId, setSessionId] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [pasteMessage, setPasteMessage] = useState("");
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");

  const formatTime = useCallback((seconds) => {
    const normalized = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    const mins = Math.floor(normalized / 60)
      .toString()
      .padStart(2, "0");
    const secs = (normalized % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, []);

  const terminateInterview = useCallback((reason) => {
    setIsTerminated(true);
    setTerminationReason(reason);
    setCurrentQuestion(null);
    setError("");
    setPasteMessage("");
  }, []);

  const pushAssistantMessage = useCallback((question) => {
    if (!question?.prompt) {
      return;
    }

    setHistory((previous) => {
      const lastItem = previous[previous.length - 1];

      if (lastItem?.role === "assistant" && lastItem.questionId === question.questionId) {
        return previous;
      }

      return [
        ...previous,
        {
          role: "assistant",
          questionId: question.questionId,
          content: question.prompt,
        },
      ];
    });
  }, []);

  const finishSession = useCallback(
    async (sid) => {
      const resultPayload = normalizeInterviewResult(await getInterviewResult(sid));

      navigate(`/interview-results/${sid}`, {
        state: {
          ...applicationMeta,
          sessionId: sid,
          result: resultPayload,
        },
      });
    },
    [applicationMeta, navigate],
  );

  const loadNextQuestion = useCallback(
    async (sid) => {
      const nextPayload = await getNextInterviewQuestion(sid);
      const nextQuestion = normalizeInterviewQuestion(
        nextPayload?.question ??
          nextPayload?.currentQuestion ??
          nextPayload?.nextQuestion ??
          nextPayload,
      );

      if (nextQuestion?.prompt && !nextQuestion.isCompleted) {
        setCurrentQuestion(nextQuestion);
        setAnswer("");
        setSecondsRemaining(300);
        pushAssistantMessage(nextQuestion);
        return;
      }

      if (nextPayload?.result) {
        navigate(`/interview-results/${sid}`, {
          state: {
            ...applicationMeta,
            sessionId: sid,
            result: normalizeInterviewResult(nextPayload.result),
          },
        });
        return;
      }

      await finishSession(sid);
    },
    [applicationMeta, finishSession, navigate, pushAssistantMessage],
  );

  useEffect(() => {
    if (!applicationId) {
      setError("The interview link is missing an application id.");
      setLoading(false);
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const acceptedDisclaimer =
      location.state?.acknowledged === true ||
      sessionStorage.getItem(disclaimerKey) === "accepted";

    if (!acceptedDisclaimer) {
      navigate(`/interview/${applicationId}/disclaimer`, {
        replace: true,
        state: {
          ...location.state,
          applicationId,
        },
      });
      return;
    }

    sessionStorage.setItem(disclaimerKey, "accepted");

    let mounted = true;

    const initializeInterview = async () => {
      setLoading(true);
      setError("");
      setIsTerminated(false);
      setTerminationReason("");
      setPasteMessage("");

      try {
        const startPayload = await startInterview(applicationId);
        const resolvedSessionId =
          startPayload?.sessionId ||
          startPayload?.SessionId ||
          startPayload?.id ||
          startPayload?.Id;

        if (!mounted) {
          return;
        }

        if (!resolvedSessionId) {
          throw new Error("The backend did not return a session id for this interview.");
        }

        setSessionId(resolvedSessionId);

        const initialQuestion = normalizeInterviewQuestion(
          startPayload?.question ??
            startPayload?.currentQuestion ??
            startPayload?.nextQuestion ??
            startPayload,
        );

        if (initialQuestion?.prompt && !initialQuestion.isCompleted) {
          setCurrentQuestion(initialQuestion);
          pushAssistantMessage(initialQuestion);
        } else {
          await loadNextQuestion(resolvedSessionId);
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            err?.message ||
            "Unable to start the interview.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeInterview();

    return () => {
      mounted = false;
    };
  }, [applicationId, disclaimerKey, loadNextQuestion, location.state, navigate, pushAssistantMessage]);

  useEffect(() => {
    if (!currentQuestion?.questionId || loading || submitting || isTerminated) {
      return;
    }

    const timerId = window.setInterval(() => {
      setSecondsRemaining((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [currentQuestion?.questionId, loading, submitting, isTerminated]);

  useEffect(() => {
    if (loading || !sessionId || isTerminated) {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        terminateInterview(
          "Cheating detected: switching tabs or minimizing the window is prohibited. The interview has been terminated.",
        );
      }
    };

    const handleWindowBlur = () => {
      if (!document.hasFocus()) {
        terminateInterview(
          "Cheating detected: leaving the interview tab is prohibited. The interview has been terminated.",
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isTerminated, loading, sessionId, terminateInterview]);

  const handleQuestionTimeout = useCallback(async () => {
    if (!currentQuestion?.questionId || !sessionId || loading || submitting || isTerminated) {
      return;
    }

    setSubmitting(true);
    setPasteMessage("");

    try {
      setHistory((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "Time limit reached for this question. Moving to the next one.",
        },
      ]);

      await submitInterviewAnswer({
        questionId: currentQuestion.questionId,
        responseText: "",
      });

      await loadNextQuestion(sessionId);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          err?.message ||
          "Unable to continue after the timer ended.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [currentQuestion?.questionId, isTerminated, loadNextQuestion, loading, sessionId, submitting]);

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleQuestionTimeout();
    }
  }, [handleQuestionTimeout, secondsRemaining]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentQuestion?.questionId || !answer.trim() || !sessionId || isTerminated) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      setHistory((previous) => [
        ...previous,
        {
          role: "user",
          content: answer.trim(),
        },
      ]);

      await submitInterviewAnswer({
        questionId: currentQuestion.questionId,
        responseText: answer.trim(),
      });

      await loadNextQuestion(sessionId);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.title ||
          err?.message ||
          "Unable to submit your answer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const transcript = history.length > 0 ? history : [];

  const handlePasteBlocked = (event) => {
    event.preventDefault();
    setPasteMessage("Pasting is disabled during the interview.");
  };

  const handleDropBlocked = (event) => {
    event.preventDefault();
    setPasteMessage("Drag-and-drop is disabled during the interview.");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,213,188,0.45),transparent_30%),linear-gradient(180deg,#FFF9F5_0%,#FFFFFF_35%,#FFFDFC_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.9fr)]">
        <section className="rounded-3xl border border-[#F1DED3] bg-white/95 p-5 shadow-[0_18px_60px_rgba(122,62,29,0.08)] backdrop-blur">
          <Link
            to="/applications"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D] transition hover:text-[#5E2F15]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to applications
          </Link>

          <div className="mt-5 flex flex-col gap-3 border-b border-[#F2E4DA] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-poppins-semibold uppercase tracking-[0.22em] text-[#C26A42]">
                AI interview session
              </p>
              <h1 className="mt-2 text-3xl font-poppins-semibold text-[#1B1B1B] sm:text-4xl">
                {applicationMeta.jobTitle}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {applicationMeta.companyName} · {applicationMeta.jobLocation} · {applicationMeta.jobSalary}
              </p>
            </div>
            <div className="rounded-2xl border border-[#F3E0D6] bg-[#FFF5EE] px-4 py-3 text-sm text-[#8A4A2A]">
              Session {sessionId ? `#${String(sessionId).slice(0, 8)}` : "starting..."}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#F3E0D6] bg-[#FFF8F4] px-4 py-3 text-sm text-[#8A4A2A]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-medium">
                <Timer className="h-4 w-4" />
                Question timer: {formatTime(secondsRemaining)}
              </span>
              <span className="text-xs">
                5 minutes per question. When time is up, the question is terminated automatically.
              </span>
            </div>
          </div>

          {isTerminated && (
            <div className="mt-5 rounded-2xl border border-red-300 bg-red-50 px-4 py-4 text-sm text-red-700">
              <div className="mb-2 inline-flex items-center gap-2 font-semibold">
                <ShieldAlert className="h-4 w-4" />
                Interview terminated
              </div>
              <p>{terminationReason}</p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {pasteMessage && !isTerminated && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {pasteMessage}
            </div>
          )}

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="flex items-center gap-3 rounded-3xl border border-dashed border-[#F1DED3] bg-[#FFF8F4] px-5 py-8 text-sm text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin text-[#C26A42]" />
                Preparing your interview session...
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {transcript.length === 0 ? (
                    <div className="rounded-3xl border border-[#F1DED3] bg-[#FFF8F4] px-5 py-6 text-sm text-gray-600">
                      Your first question will appear here.
                    </div>
                  ) : (
                    transcript.map((item, index) => (
                      <div
                        key={`${item.role}-${index}`}
                        className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[80%] ${
                            item.role === "user"
                              ? "bg-[#7A3E1D] text-white"
                              : "border border-[#F1DED3] bg-white text-[#1F1F1F]"
                          }`}
                        >
                          {item.role === "assistant" && (
                            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#C26A42]">
                              <Bot className="h-3.5 w-3.5" />
                              Interviewer
                            </div>
                          )}
                          {item.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {currentQuestion?.prompt && !isTerminated && (
                  <form onSubmit={handleSubmit} className="rounded-3xl border border-[#F1DED3] bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                      <MessageSquareText className="h-4 w-4" />
                      Your answer
                    </div>
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onPaste={handlePasteBlocked}
                      onDrop={handleDropBlocked}
                      placeholder="Type your response here..."
                      rows={5}
                      className="mt-3 w-full rounded-2xl border border-[#E7D9D0] px-4 py-3 text-sm outline-none transition focus:border-[#C26A42] focus:ring-2 focus:ring-[#FFD8C5]"
                    />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs text-gray-500">
                        Press submit when you are ready for the next question.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting || !answer.trim() || isTerminated}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#7A3E1D] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit answer
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-3xl border border-[#F1DED3] bg-white p-5 shadow-[0_18px_60px_rgba(122,62,29,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF2EA] text-[#C26A42]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-poppins-semibold text-[#1B1B1B]">
                  How this works
                </h2>
                <p className="text-sm text-gray-600">
                  A guided interview session streams one question at a time.
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              <li className="rounded-2xl bg-[#FFF8F4] px-4 py-3">1. Your application is started by the job detail page.</li>
              <li className="rounded-2xl bg-[#FFF8F4] px-4 py-3">2. The backend creates a session and serves the next question.</li>
              <li className="rounded-2xl bg-[#FFF8F4] px-4 py-3">3. Each answer is saved before the next question is requested.</li>
              <li className="rounded-2xl bg-[#FFF8F4] px-4 py-3">4. Switching tabs or leaving the interview window terminates the session.</li>
              <li className="rounded-2xl bg-[#FFF8F4] px-4 py-3">5. Pasting and drag-and-drop are disabled, and each question has a 5-minute limit.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-[#F1DED3] bg-[#FFF8F4] p-5 shadow-sm">
            <h3 className="text-base font-poppins-semibold text-[#1B1B1B]">Need to leave?</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              You can come back to the applications page and pick up your interview status later.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/applications"
                className="inline-flex items-center justify-center rounded-xl bg-[#7A3E1D] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                My applications
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center rounded-xl border border-[#E7D9D0] bg-white px-4 py-2.5 text-sm font-medium text-[#7A3E1D] transition hover:bg-[#FFF6F1]"
              >
                Browse more jobs
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default InterviewSessionPage;