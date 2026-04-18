import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  getProfile,
  completeProfile,
  updateProfile,
  deleteProfile,
} from "../../utilities/api/profileApi";
import {
  Github,
  Globe,
  Linkedin,
  Camera,
  Pencil,
  Trash2,
  ExternalLink,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

// ── Toast ─────────────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-poppins-medium transition-all
        ${toast.type === "error" ? "bg-red-500 text-white" : "bg-[#1a1a1a] text-white"}`}
    >
      {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      {toast.message}
    </div>
  );
};

// ── Input Field ───────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", value, onChange, placeholder, icon, disabled }) => {
  const Icon = icon;

  return (
    <div>
      <label className="block text-xs font-poppins-medium text-gray-500 mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? "pl-9" : "pl-4"} pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-poppins placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-[#D3571F]/30 focus:border-[#D3571F]/50
            disabled:bg-gray-50 disabled:text-gray-400 transition-colors`}
        />
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
        <Trash2 className="w-5 h-5 text-red-500" />
      </div>
      <h3 className="font-poppins-semibold text-[#1a1a1a] mb-1">Delete Profile?</h3>
      <p className="text-sm font-poppins text-gray-500 mb-6">
        This will permanently delete your profile information. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-poppins-medium text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-poppins-medium hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ── Social Link display ───────────────────────────────────────────────────
const SocialLink = ({ href, icon, label, color }) => {
  const Icon = icon;

  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-poppins-medium transition-all hover:-translate-y-0.5 hover:shadow-sm ${color}`}
    >
      <Icon className="w-4 h-4" />
      {label}
      <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
    </a>
  );
};

// ── Main Component ────────────────────────────────────────────────────────
const ProfilePage = () => {
  const [profile, setProfile]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [editing, setEditing]       = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast]           = useState(null);
  const fileRef                     = useRef(null);

  const emptyForm = { Bio: "", LinkedInURL: "", GitHubURL: "", WebsiteURL: "", PhotoFile: null };
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── load profile ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return; }
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        if (!active) return;
        if (data) {
          setProfile(data);
          setHasProfile(true);
          setForm({
            Bio: data.bio ?? data.Bio ?? "",
            LinkedInURL: data.linkedInURL ?? data.LinkedInURL ?? "",
            GitHubURL: data.gitHubURL ?? data.GitHubURL ?? "",
            WebsiteURL: data.websiteURL ?? data.WebsiteURL ?? "",
            PhotoFile: null,
          });
          setPreview(data.photoUrl ?? data.PhotoUrl ?? null);
        } else {
          setHasProfile(false);
        }
      } catch {
        if (!active) return;
        setHasProfile(false);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [isLoggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, PhotoFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const buildFormData = () => {
    const fd = new FormData();
    if (form.Bio)         fd.append("Bio", form.Bio);
    if (form.LinkedInURL) fd.append("LinkedInURL", form.LinkedInURL);
    if (form.GitHubURL)   fd.append("GitHubURL", form.GitHubURL);
    if (form.WebsiteURL)  fd.append("WebsiteURL", form.WebsiteURL);
    if (form.PhotoFile)   fd.append("PhotoFile", form.PhotoFile);
    return fd;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = buildFormData();
      const result = hasProfile ? await updateProfile(fd) : await completeProfile(fd);
      setProfile(result ?? { ...form, photoUrl: preview });
      setHasProfile(true);
      setEditing(false);
      showToast(hasProfile ? "Profile updated ✓" : "Profile created ✓");
    } catch {
      showToast("Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowDelete(false);
    try {
      await deleteProfile();
      setProfile(null);
      setHasProfile(false);
      setForm(emptyForm);
      setPreview(null);
      showToast("Profile deleted");
    } catch {
      showToast("Failed to delete profile", "error");
    }
  };

  // ── not logged in ──────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 bg-[#FFECE3] rounded-2xl flex items-center justify-center">
          <User className="w-7 h-7 text-[#D3571F]" />
        </div>
        <h2 className="font-poppins-semibold text-[#1a1a1a] text-lg text-center">Sign in to view your profile</h2>
        <p className="font-poppins text-sm text-gray-500 text-center max-w-sm">
          You need to be logged in to access your profile page.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 bg-[#D3571F] text-white rounded-xl text-sm font-poppins-medium hover:bg-[#B8461A] transition-colors"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  // ── loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FFECE3] border-t-[#D3571F] rounded-full animate-spin" />
          <p className="text-sm font-poppins text-gray-400">Loading profile…</p>
        </div>
      </main>
    );
  }

  // ── derived display values ─────────────────────────────────────────
  const displayBio        = profile?.bio        ?? profile?.Bio        ?? "";
  const displayLinkedIn   = profile?.linkedInURL ?? profile?.LinkedInURL ?? "";
  const displayGitHub     = profile?.gitHubURL   ?? profile?.GitHubURL   ?? "";
  const displayWebsite    = profile?.websiteURL  ?? profile?.WebsiteURL  ?? "";
  const displayPhoto      = preview ?? profile?.photoUrl ?? profile?.PhotoUrl ?? null;
  const displayName       = profile?.firstName
    ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
    : profile?.userName ?? profile?.email ?? "Your Profile";

  const isEditMode = editing || !hasProfile;

  return (
    <main className="w-full min-h-screen border-b border-[#4242425C]/20 bg-[#F9F6F3]">
      {/* Hero Banner */}
      <div className="w-full h-36 bg-gradient-to-r from-[#D3571F] via-[#E46E39] to-[#FF9768] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-12">
        {/* Avatar + header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-6">
          <div className="relative w-fit">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-[#FFECE3] flex items-center justify-center">
              {displayPhoto ? (
                <img src={displayPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[#D3571F]" />
              )}
            </div>
            {isEditMode && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#D3571F] rounded-lg flex items-center justify-center shadow-sm hover:bg-[#B8461A] transition-colors"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </>
            )}
          </div>

          {/* Action buttons (view mode) */}
          {!isEditMode && hasProfile && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-poppins-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-100 text-sm font-poppins-medium text-red-400 bg-white hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}

          {/* Save / Cancel (edit mode) */}
          {isEditMode && (
            <div className="flex items-center gap-2">
              {hasProfile && (
                <button
                  onClick={() => { setEditing(false); setPreview(profile?.photoUrl ?? null); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-poppins-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#D3571F] text-white text-sm font-poppins-medium hover:bg-[#B8461A] disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving…" : hasProfile ? "Save Changes" : "Create Profile"}
              </button>
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="font-poppins-bold text-[22px] text-[#1a1a1a] leading-tight mb-1">{displayName}</h1>

        {/* ── VIEW MODE ──────────────────────────────────────────────── */}
        {!isEditMode && (
          <div className="space-y-6 mt-4">
            {/* Bio */}
            {displayBio ? (
              <div className="bg-white border border-[#4242425C]/20 rounded-2xl p-5">
                <h2 className="text-xs font-poppins-semibold text-gray-400 uppercase tracking-wider mb-2">About</h2>
                <p className="text-sm font-poppins text-[#3a3a3a] leading-relaxed whitespace-pre-line">{displayBio}</p>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-sm font-poppins text-gray-400">No bio added yet.</p>
              </div>
            )}

            {/* Links */}
            {(displayLinkedIn || displayGitHub || displayWebsite) && (
              <div className="bg-white border border-[#4242425C]/20 rounded-2xl p-5">
                <h2 className="text-xs font-poppins-semibold text-gray-400 uppercase tracking-wider mb-3">Links</h2>
                <div className="flex flex-col gap-2">
                  <SocialLink href={displayLinkedIn} icon={Linkedin} label="LinkedIn" color="border-blue-100 text-blue-600 hover:bg-blue-50" />
                  <SocialLink href={displayGitHub}   icon={Github}   label="GitHub"   color="border-gray-200 text-gray-700 hover:bg-gray-50" />
                  <SocialLink href={displayWebsite}  icon={Globe}    label="Website"  color="border-[#FFECE3] text-[#D3571F] hover:bg-[#FFECE3]" />
                </div>
              </div>
            )}

            {/* No links placeholder */}
            {!displayLinkedIn && !displayGitHub && !displayWebsite && (
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-sm font-poppins text-gray-400">No links added yet.</p>
                <button onClick={() => setEditing(true)} className="mt-2 text-xs font-poppins-medium text-[#D3571F] hover:underline">
                  Add links →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── EDIT / CREATE MODE ─────────────────────────────────────── */}
        {isEditMode && (
          <div className="space-y-5 mt-4">
            {!hasProfile && (
              <div className="flex items-start gap-3 bg-[#FFECE3] border border-[#E46E39]/30 rounded-xl px-4 py-3">
                <User className="w-4 h-4 text-[#D3571F] mt-0.5 flex-shrink-0" />
                <p className="text-sm font-poppins text-[#A85A35] leading-relaxed">
                  You haven't set up your profile yet. Fill in the fields below to get started.
                </p>
              </div>
            )}

            {/* Bio */}
            <div className="bg-white border border-[#4242425C]/20 rounded-2xl p-5">
              <h2 className="text-xs font-poppins-semibold text-gray-400 uppercase tracking-wider mb-3">About You</h2>
              <div>
                <label className="block text-xs font-poppins-medium text-gray-500 mb-1.5">Bio</label>
                <textarea
                  name="Bio"
                  value={form.Bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write a short bio about yourself…"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-poppins placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3571F]/30 focus:border-[#D3571F]/50 resize-none"
                />
                <p className="text-right text-[11px] font-poppins text-gray-300 mt-1">{form.Bio.length}/500</p>
              </div>
            </div>

            {/* Links */}
            <div className="bg-white border border-[#4242425C]/20 rounded-2xl p-5 space-y-4">
              <h2 className="text-xs font-poppins-semibold text-gray-400 uppercase tracking-wider">Links</h2>
              <Field label="LinkedIn URL" name="LinkedInURL" type="url" value={form.LinkedInURL} onChange={handleChange} placeholder="https://linkedin.com/in/yourname" icon={Linkedin} />
              <Field label="GitHub URL"   name="GitHubURL"   type="url" value={form.GitHubURL}   onChange={handleChange} placeholder="https://github.com/yourname"   icon={Github} />
              <Field label="Website URL"  name="WebsiteURL"  type="url" value={form.WebsiteURL}  onChange={handleChange} placeholder="https://yourwebsite.com"        icon={Globe} />
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {showDelete && <DeleteModal onConfirm={handleDelete} onClose={() => setShowDelete(false)} />}

      {/* Toast */}
      <Toast toast={toast} />
    </main>
  );
};

export default ProfilePage;
