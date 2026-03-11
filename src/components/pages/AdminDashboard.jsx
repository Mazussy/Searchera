import React, { useState, useEffect, useCallback } from "react";
import {
  getPendingCompanies,
  getPendingJobs,
  getAllCategories,
  approveCompany,
  rejectCompany,
  approveJob,
  rejectJob,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllJobs,
  getAllCompanies,
} from "../../utilities/api/adminApi";

// ── helpers ────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "orange" }) => {
  const colors = {
    orange: "bg-[#FFECE3] text-[#D3571F] border-[#E46E39]/30",
    green:  "bg-green-50   text-green-700 border-green-200",
    red:    "bg-red-50     text-red-600   border-red-200",
    gray:   "bg-gray-100   text-gray-600  border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-poppins-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, accent = false }) => (
  <div className={`rounded-2xl border p-5 flex items-center gap-4 transition-all hover:shadow-md ${accent ? "bg-[#D3571F] border-[#B8461A] text-white" : "bg-white border-[#4242425C]/20"}`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${accent ? "bg-white/20" : "bg-[#FFECE3]"}`}>
      {icon}
    </div>
    <div>
      <p className={`text-xs font-poppins ${accent ? "text-white/75" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl font-poppins-bold leading-tight ${accent ? "text-white" : "text-[#1a1a1a]"}`}>{value}</p>
      {sub && <p className={`text-xs font-poppins mt-0.5 ${accent ? "text-white/65" : "text-gray-400"}`}>{sub}</p>}
    </div>
  </div>
);

const SectionHeader = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-5">
    <h2 className="font-poppins-semibold text-[#1a1a1a] text-lg">{title}</h2>
    {count !== undefined && (
      <span className="bg-[#FFECE3] text-[#D3571F] text-xs font-poppins-medium px-2 py-0.5 rounded-full border border-[#E46E39]/30">
        {count}
      </span>
    )}
  </div>
);

// ── Reject Modal ───────────────────────────────────────────────────────────
const RejectModal = ({ type, item, onConfirm, onClose }) => {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 text-lg">✕</div>
          <div>
            <h3 className="font-poppins-semibold text-[#1a1a1a]">Reject {type}</h3>
            <p className="text-xs text-gray-500 font-poppins">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm font-poppins text-gray-700 mb-4">
          You're about to reject <span className="font-poppins-semibold text-[#1a1a1a]">{item}</span>. Please provide a reason (optional):
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder={type === "Job" ? "e.g. Incomplete description..." : "e.g. Missing documentation..."}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-poppins placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D3571F]/40 resize-none"
        />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-poppins-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-poppins-medium text-white hover:bg-red-600 transition-colors">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Category Modal ─────────────────────────────────────────────────────────
const CategoryModal = ({ category, onConfirm, onClose }) => {
  const [name, setName] = useState(category?.categoryName ?? "");
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-poppins-semibold text-[#1a1a1a] mb-4">{category ? "Edit Category" : "Add Category"}</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-poppins focus:outline-none focus:ring-2 focus:ring-[#D3571F]/40"
        />
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-poppins-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => name.trim().length >= 3 && onConfirm(name.trim())}
            disabled={name.trim().length < 3}
            className="flex-1 rounded-xl bg-[#D3571F] py-2.5 text-sm font-poppins-medium text-white hover:bg-[#B8461A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {category ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Tabs ───────────────────────────────────────────────────────────────────
const tabs = [
  { id: "overview",   label: "Overview",   icon: "⊞" },
  { id: "jobs",       label: "Pending Jobs",       icon: "💼" },
  { id: "companies",  label: "Pending Companies",  icon: "🏢" },
  { id: "categories", label: "Categories",  icon: "🏷️" },
];

// ── Main Component ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingJobs, setPendingJobs] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); // { type, id, name }
  const [categoryModal, setCategoryModal] = useState(null); // null | { category? }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pJobs, pCompanies, cats, aJobs, aCompanies] = await Promise.allSettled([
        getPendingJobs(),
        getPendingCompanies(),
        getAllCategories(),
        getAllJobs(),
        getAllCompanies(),
      ]);
      if (pJobs.status === "fulfilled")      setPendingJobs(Array.isArray(pJobs.value) ? pJobs.value : []);
      if (pCompanies.status === "fulfilled") setPendingCompanies(Array.isArray(pCompanies.value) ? pCompanies.value : []);
      if (cats.status === "fulfilled")       setCategories(Array.isArray(cats.value) ? cats.value : []);
      if (aJobs.status === "fulfilled")      setAllJobs(Array.isArray(aJobs.value) ? aJobs.value : []);
      if (aCompanies.status === "fulfilled") setAllCompanies(Array.isArray(aCompanies.value) ? aCompanies.value : []);
    } catch (err) {
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Job actions ────────────────────────────────────────────────────────
  const handleApproveJob = async (id) => {
    setActionLoading(id);
    try {
      await approveJob(id);
      setPendingJobs((prev) => prev.filter((j) => (j.id ?? j.jobId) !== id));
      showToast("Job approved successfully ✓");
    } catch { showToast("Failed to approve job", "error"); }
    finally { setActionLoading(null); }
  };

  const handleRejectJob = async (id, summary) => {
    setActionLoading(id);
    setRejectModal(null);
    try {
      await rejectJob(id, summary);
      setPendingJobs((prev) => prev.filter((j) => (j.id ?? j.jobId) !== id));
      showToast("Job rejected");
    } catch { showToast("Failed to reject job", "error"); }
    finally { setActionLoading(null); }
  };

  // ── Company actions ────────────────────────────────────────────────────
  const handleApproveCompany = async (id) => {
    setActionLoading(id);
    try {
      await approveCompany(id);
      setPendingCompanies((prev) => prev.filter((c) => (c.id ?? c.companyId) !== id));
      showToast("Company approved successfully ✓");
    } catch { showToast("Failed to approve company", "error"); }
    finally { setActionLoading(null); }
  };

  const handleRejectCompany = async (id, reason) => {
    setActionLoading(id);
    setRejectModal(null);
    try {
      await rejectCompany(id, reason);
      setPendingCompanies((prev) => prev.filter((c) => (c.id ?? c.companyId) !== id));
      showToast("Company rejected");
    } catch { showToast("Failed to reject company", "error"); }
    finally { setActionLoading(null); }
  };

  // ── Category actions ───────────────────────────────────────────────────
  const handleAddCategory = async (name) => {
    setCategoryModal(null);
    try {
      await addCategory(name);
      await loadData();
      showToast("Category added ✓");
    } catch { showToast("Failed to add category", "error"); }
  };

  const handleEditCategory = async (id, name) => {
    setCategoryModal(null);
    try {
      await updateCategory(id, name);
      await loadData();
      showToast("Category updated ✓");
    } catch { showToast("Failed to update category", "error"); }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => (c.id ?? c.categoryId) !== id));
      showToast("Category deleted");
    } catch { showToast("Failed to delete category", "error"); }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F9F6F3] flex">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#4242425C]/20 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#4242425C]/20 flex-shrink-0">
          <span className="text-[22px] text-[#D3571F] font-alatsi tracking-widest">SEARCHERA</span>
          <span className="ml-2 text-[10px] font-poppins-semibold text-[#D3571F]/60 uppercase tracking-widest mt-1">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-poppins-medium transition-all text-left
                ${activeTab === tab.id
                  ? "bg-[#FFECE3] text-[#D3571F]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#D3571F]"}`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "jobs" && pendingJobs.length > 0 && (
                <span className="ml-auto bg-[#D3571F] text-white text-[10px] font-poppins-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {pendingJobs.length}
                </span>
              )}
              {tab.id === "companies" && pendingCompanies.length > 0 && (
                <span className="ml-auto bg-[#D3571F] text-white text-[10px] font-poppins-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {pendingCompanies.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-[#4242425C]/20">
          <button
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-poppins-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <span>⇠</span> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#4242425C]/20 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-500 hover:text-[#D3571F] transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="font-poppins-semibold text-[#1a1a1a] text-base leading-tight">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-gray-400 font-poppins">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-poppins-medium text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <span className={loading ? "animate-spin" : ""}>⟳</span>
            Refresh
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#FFECE3] border-t-[#D3571F] rounded-full animate-spin" />
                <p className="text-sm font-poppins text-gray-400">Loading data…</p>
              </div>
            </div>
          ) : (
            <>
              {/* ── OVERVIEW ── */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon="💼" label="Pending Jobs"      value={pendingJobs.length}      sub="Awaiting review"   accent />
                    <StatCard icon="🏢" label="Pending Companies" value={pendingCompanies.length} sub="Awaiting review" />
                    <StatCard icon="📋" label="Total Jobs"        value={allJobs.length}          sub="All listed jobs" />
                    <StatCard icon="🏷️" label="Categories"        value={categories.length}       sub="Active categories" />
                  </div>

                  {/* Quick action tiles */}
                  <div>
                    <SectionHeader title="Quick Actions" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: "Review Pending Jobs",       sub: `${pendingJobs.length} jobs need attention`,       tab: "jobs",       icon: "💼", urgent: pendingJobs.length > 0 },
                        { label: "Review Pending Companies",  sub: `${pendingCompanies.length} companies need review`, tab: "companies",  icon: "🏢", urgent: pendingCompanies.length > 0 },
                        { label: "Manage Categories",         sub: `${categories.length} categories active`,           tab: "categories", icon: "🏷️", urgent: false },
                      ].map((action) => (
                        <button
                          key={action.tab}
                          onClick={() => setActiveTab(action.tab)}
                          className={`text-left p-5 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 group
                            ${action.urgent ? "bg-white border-[#E46E39]/30" : "bg-white border-[#4242425C]/20"}`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-2xl">{action.icon}</span>
                            {action.urgent && (
                              <span className="w-2 h-2 bg-[#D3571F] rounded-full mt-1 animate-pulse" />
                            )}
                          </div>
                          <p className="font-poppins-semibold text-[#1a1a1a] mt-3 text-sm">{action.label}</p>
                          <p className="text-xs text-gray-500 font-poppins mt-1">{action.sub}</p>
                          <div className="mt-3 text-[#D3571F] text-xs font-poppins-medium group-hover:underline">View →</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent pending snapshot */}
                  {(pendingJobs.length > 0 || pendingCompanies.length > 0) && (
                    <div>
                      <SectionHeader title="Needs Attention" />
                      <div className="bg-white border border-[#4242425C]/20 rounded-2xl divide-y divide-[#4242425C]/10 overflow-hidden">
                        {pendingJobs.slice(0, 3).map((job) => {
                          const id = job.id ?? job.jobId;
                          return (
                            <div key={id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#FFECE3] rounded-lg flex items-center justify-center text-sm">💼</div>
                                <div>
                                  <p className="text-sm font-poppins-medium text-[#1a1a1a]">{job.title ?? "Untitled Job"}</p>
                                  <p className="text-xs text-gray-400 font-poppins">{job.location ?? "—"}</p>
                                </div>
                              </div>
                              <Badge color="orange">Pending Job</Badge>
                            </div>
                          );
                        })}
                        {pendingCompanies.slice(0, 3).map((co) => {
                          const id = co.id ?? co.companyId;
                          return (
                            <div key={id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#FFECE3] rounded-lg flex items-center justify-center text-sm">🏢</div>
                                <div>
                                  <p className="text-sm font-poppins-medium text-[#1a1a1a]">{co.companyName ?? "Unnamed Company"}</p>
                                  <p className="text-xs text-gray-400 font-poppins">{co.industry ?? "—"}</p>
                                </div>
                              </div>
                              <Badge color="orange">Pending Company</Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── PENDING JOBS ── */}
              {activeTab === "jobs" && (
                <div>
                  <SectionHeader title="Pending Jobs" count={pendingJobs.length} />
                  {pendingJobs.length === 0 ? (
                    <EmptyState icon="💼" message="No pending jobs — you're all caught up!" />
                  ) : (
                    <div className="space-y-3">
                      {pendingJobs.map((job) => {
                        const id = job.id ?? job.jobId;
                        const isLoading = actionLoading === id;
                        return (
                          <div key={id} className="bg-white border border-[#4242425C]/20 rounded-2xl p-5 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h3 className="font-poppins-semibold text-[#1a1a1a] text-sm">{job.title ?? "Untitled"}</h3>
                                  <Badge color="orange">Pending</Badge>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-poppins text-gray-500 mt-1">
                                  {job.location  && <span>📍 {job.location}</span>}
                                  {job.salaryRange && <span>💰 {job.salaryRange}</span>}
                                  {job.jobType !== undefined && <span>⏱ Type {job.jobType}</span>}
                                  {job.deadline  && <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
                                </div>
                                {job.summary && (
                                  <p className="text-xs text-gray-600 font-poppins mt-2 line-clamp-2">{job.summary}</p>
                                )}
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  disabled={isLoading}
                                  onClick={() => handleApproveJob(id)}
                                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-poppins-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                  {isLoading ? "…" : "Approve"}
                                </button>
                                <button
                                  disabled={isLoading}
                                  onClick={() => setRejectModal({ type: "Job", id, name: job.title ?? "this job" })}
                                  className="px-4 py-2 bg-red-100 hover:bg-red-500 hover:text-white text-red-500 text-xs font-poppins-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── PENDING COMPANIES ── */}
              {activeTab === "companies" && (
                <div>
                  <SectionHeader title="Pending Companies" count={pendingCompanies.length} />
                  {pendingCompanies.length === 0 ? (
                    <EmptyState icon="🏢" message="No pending companies — you're all caught up!" />
                  ) : (
                    <div className="space-y-3">
                      {pendingCompanies.map((co) => {
                        const id = co.id ?? co.companyId;
                        const isLoading = actionLoading === id;
                        return (
                          <div key={id} className="bg-white border border-[#4242425C]/20 rounded-2xl p-5 hover:shadow-sm transition-all">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                {co.logoUrl ? (
                                  <img src={co.logoUrl} alt={co.companyName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                                ) : (
                                  <div className="w-12 h-12 bg-[#FFECE3] rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏢</div>
                                )}
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="font-poppins-semibold text-[#1a1a1a] text-sm">{co.companyName ?? "Unnamed"}</h3>
                                    <Badge color="orange">Pending</Badge>
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-poppins text-gray-500">
                                    {co.industry && <span>🏭 {co.industry}</span>}
                                    {co.website  && <a href={co.website} target="_blank" rel="noreferrer" className="text-[#D3571F] hover:underline truncate max-w-[180px]">🔗 {co.website}</a>}
                                  </div>
                                  {co.description && (
                                    <p className="text-xs text-gray-600 font-poppins mt-1.5 line-clamp-2">{co.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  disabled={isLoading}
                                  onClick={() => handleApproveCompany(id)}
                                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-poppins-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                  {isLoading ? "…" : "Approve"}
                                </button>
                                <button
                                  disabled={isLoading}
                                  onClick={() => setRejectModal({ type: "Company", id, name: co.companyName ?? "this company" })}
                                  className="px-4 py-2 bg-red-100 hover:bg-red-500 hover:text-white text-red-500 text-xs font-poppins-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── CATEGORIES ── */}
              {activeTab === "categories" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <SectionHeader title="Categories" count={categories.length} />
                    <button
                      onClick={() => setCategoryModal({})}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D3571F] text-white text-sm font-poppins-medium rounded-xl hover:bg-[#B8461A] transition-colors"
                    >
                      <span>+</span> Add Category
                    </button>
                  </div>
                  {categories.length === 0 ? (
                    <EmptyState icon="🏷️" message="No categories yet. Add one to get started." />
                  ) : (
                    <div className="bg-white border border-[#4242425C]/20 rounded-2xl overflow-hidden">
                      <div className="grid grid-cols-[1fr_auto] gap-0 divide-y divide-[#4242425C]/10">
                        {categories.map((cat, i) => {
                          const id = cat.id ?? cat.categoryId;
                          return (
                            <React.Fragment key={id ?? i}>
                              <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                                <div className="w-7 h-7 bg-[#FFECE3] rounded-lg flex items-center justify-center text-[11px] text-[#D3571F] font-poppins-bold flex-shrink-0">
                                  {(i + 1).toString().padStart(2, "0")}
                                </div>
                                <span className="text-sm font-poppins-medium text-[#1a1a1a]">{cat.categoryName}</span>
                              </div>
                              <div className="flex items-center gap-2 px-5 py-3.5 hover:bg-gray-50 transition-colors justify-end">
                                <button
                                  onClick={() => setCategoryModal({ category: cat })}
                                  className="text-xs font-poppins-medium text-gray-500 hover:text-[#D3571F] transition-colors px-2 py-1 rounded-lg hover:bg-[#FFECE3]"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(id)}
                                  className="text-xs font-poppins-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-poppins-medium transition-all
            ${toast.type === "error" ? "bg-red-500 text-white" : "bg-[#1a1a1a] text-white"}`}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          {toast.message}
        </div>
      )}

      {/* ── Reject Modal ── */}
      {rejectModal && (
        <RejectModal
          type={rejectModal.type}
          item={rejectModal.name}
          onClose={() => setRejectModal(null)}
          onConfirm={(reason) =>
            rejectModal.type === "Job"
              ? handleRejectJob(rejectModal.id, reason)
              : handleRejectCompany(rejectModal.id, reason)
          }
        />
      )}

      {/* ── Category Modal ── */}
      {categoryModal !== null && (
        <CategoryModal
          category={categoryModal.category}
          onClose={() => setCategoryModal(null)}
          onConfirm={(name) =>
            categoryModal.category
              ? handleEditCategory(categoryModal.category.id ?? categoryModal.category.categoryId, name)
              : handleAddCategory(name)
          }
        />
      )}
    </div>
  );
};

// ── Empty State ────────────────────────────────────────────────────────────
const EmptyState = ({ icon, message }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <p className="font-poppins text-gray-400 text-sm max-w-xs">{message}</p>
  </div>
);

export default AdminDashboard;
