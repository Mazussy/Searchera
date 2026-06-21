import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingImageOne from "../../assets/images/Landing1.png";
import LandingImageTwo from "../../assets/images/Landing2.png";
import SuitcaseIcon from "../../assets/icons/suitcase.png";
import BusinessTradeIcon from "../../assets/icons/business-and-trade.png";
import LampIcon from "../../assets/icons/lamp.png";
import MarketingIcon from "../../assets/icons/marketing.png";
import JourneyStepOneIcon from "../../assets/icons/1.png";
import JourneyStepTwoIcon from "../../assets/icons/2.png";
import JourneyStepThreeIcon from "../../assets/icons/3.png";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userType") || localStorage.getItem("role");
    if (userRole && String(userRole).toLowerCase() === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div className="hidden md:flex w-full justify-evenly items-center border-b border-b-[#4242425C]/36">
        <img src={LandingImageOne} alt="Job seeker illustration" />
        <div className="w-1/3 flex flex-col text-center justify-evenly items-center gap-3">
          <h1 className="font-poppins-bold  text-[28px] text-primary-accent ">
            Find Your Next Career Move with AI-Powered Precision
          </h1>
          <p className="font-poppins text-[14px] text-[#292624] mb-5">
            Search selected jobs, explore companies, and grow your career with
            smart tools built for the Arab job market.
          </p>
          <Link
            to="/jobs"
            className="w-sm bg-tritary-accent border border-gray-100 p-2 rounded-2xl font-poppins-semibold text-primary cursor-pointer hover:bg-secondary-accent transition-colors text-center"
          >
            Search for Jobs
          </Link>
          <Link
            to="/for-employers"
            className="w-sm border border-gray-700 p-2 rounded-2xl font-poppins-semibold text-primary cursor-pointer mb-3 hover:bg-gray-200 transition-colors text-center"
          >
            Post a Job (For Employers)
          </Link>
          <a
            href="#what-can-you-do"
            className="relative group cursor-pointer inline-block hover:bg-[#D9D9D9] px-3 py-2 pb-4 rounded-2xl transition-colors"
          >
            <p className="font-poppins-medium text-primary text-[15px] group-hover:text-[#CA6234]">
              How it works?
            </p>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 transition-all duration-300 ease-out">
              <svg
                className="w-3 h-2"
                viewBox="0 0 24 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2L12 10L22 2"
                  stroke="#CA6234"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </a>
        </div>
        <img src={LandingImageTwo} alt="Employer and opportunities illustration" />
      </div>

      {/* mobile view */}
      <div className="md:hidden w-full flex flex-col items-center border-b border-b-[#4242425C]/36 px-4 py-8 gap-5">
        <h1 className="font-poppins-bold text-[22px] text-primary-accent text-center">
          Find Your Next Career Move with AI-Powered Precision
        </h1>
        <p className="font-poppins text-[13px] text-[#292624] text-center">
          Search selected jobs, explore companies, and grow your career with
          smart tools built for the Arab job market.
        </p>
        <img
          src={LandingImageOne}
          alt="Job seeker illustration"
          className="w-full h-48 object-cover rounded-lg"
        ></img>
        <Link
          to="/jobs"
          className="w-full bg-tritary-accent border border-gray-100 p-3 rounded-2xl font-poppins-semibold text-primary cursor-pointer hover:bg-secondary-accent transition-colors text-center"
        >
          Search for Jobs
        </Link>
        <Link
          to="/for-employers"
          className="w-full border border-gray-700 p-3 rounded-2xl font-poppins-semibold text-primary cursor-pointer hover:bg-gray-200 transition-colors text-center"
        >
          Post a Job (For Employers)
        </Link>
        <a
          href="#what-can-you-do"
          className="relative group cursor-pointer inline-block hover:bg-[#D9D9D9] px-3 py-2 pb-4 rounded-2xl transition-colors"
        >
          <p className="font-poppins-medium text-primary text-[14px] group-hover:text-[#CA6234]">
            How it works?
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 -translate-y-2 transition-all duration-300 ease-out">
            <svg
              className="w-3 h-2"
              viewBox="0 0 24 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2L12 10L22 2"
                stroke="#CA6234"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </a>
      </div>
      <div
        id="what-can-you-do"
        className="w-full flex flex-col items-center gap-10 px-4 pt-8 md:gap-15 md:px-0 md:pt-10 border-b border-b-[#4242425C]/36"
      >
        <h2 className="font-ponnala text-[#373535] border-b border-b-[#4242425C]/36">
          What Can You Do
        </h2>
        <div className="w-full grid grid-cols-2 gap-8 pb-10 md:flex md:justify-evenly md:items-center md:gap-0 md:pb-0 mb-15">
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src={SuitcaseIcon} alt="Suitcase icon" />
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Find Your Perfect Job
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src={BusinessTradeIcon} alt="Business icon" />
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Explore Top Companies
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src={LampIcon} alt="Career advice icon" />
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Get Career Advice
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-3 hover:scale-105 hover:translate-1 transition-all">
            <img src={MarketingIcon} alt="Hiring icon" />
            <p className="font-poppins-semibold text-[#373535] text-sm">
              Post Jobs & Hire Talents
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-around items-center gap-10 px-4 pt-8 md:gap-15 md:px-0 md:pt-10 bg-[#FFECE3] border-b border-b-[#4242425C]/36">
        <h2 className="font-ponnala text-[#373535] border-b border-b-[#4242425C]/36">
          Your Journey With Searchera
        </h2>
        <div className="w-full flex flex-col items-stretch gap-6 md:flex-row md:justify-evenly md:items-center md:gap-0">
          <div className="w-full md:w-1/4 flex flex-col justify-evenly items-center gap-3 text-center p-4 md:p-3 hover:rounded-2xl hover:bg-[#D9D9D9]/25">
            <img src={JourneyStepOneIcon} alt="Step one" className="w-20 h-20" />
            <h3 className="font-poppins-semibold text-primary text-md">
              Browse Jobs
            </h3>
            <p className="w-full max-w-80 md:w-65 font-poppins text-[#373535] text-sm">
              Explore a wide range of jobs with smart filters that match your
              skills and preferences.
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col justify-evenly items-center gap-3 text-center p-4 md:p-3 hover:rounded-2xl hover:bg-[#D9D9D9]/25">
            <img src={JourneyStepTwoIcon} alt="Step two" className="w-20 h-20" />
            <h3 className="font-poppins-semibold text-primary text-md">
              Apply Smartly
            </h3>
            <p className="w-full max-w-80 md:w-65 font-poppins text-[#373535] text-sm">
              Submit your application and take an AI-powered interview from
              wherever you are.
            </p>
          </div>
          <div className="w-full md:w-1/4 flex flex-col justify-evenly items-center gap-3 text-center p-4 md:p-3 hover:rounded-2xl hover:bg-[#D9D9D9]/25">
            <img src={JourneyStepThreeIcon} alt="Step three" className="w-20 h-20" />
            <h3 className="font-poppins-semibold text-primary text-md">
              Get Faster Matches
            </h3>
            <p className="w-full max-w-80 md:w-65 font-poppins text-[#373535] text-sm">
              Receive instant AI feedback and get matched with employers who
              value your profile.
            </p>
          </div>
        </div>
        <p className="mb-10 font-poppins text-primary text-sm text-center md:text-lg">
          “Employers review your results and interview summary to make faster
          hiring decisions.”
        </p>
      </div>
    </>
  );
};
export default LandingPage;
