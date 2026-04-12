"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Header from "./components/layout/header";
import Sidebar from "./components/layout/sidebar";
import TrainingAnalytics from "./components/layout/traininganalytics";
import MandaysSummary from "./components/layout/mandayssummary";
import TrainingPlan from "./components/layout/trainingplan";
import TrainingCalendar from "./components/layout/trainingcalendar";

const DEPT_OPTIONS = [
  "Supply Chain",
  "QA",
  "Operation",
  "NPI",
  "HSE",
  "HR",
  "FIN & IT",
  "FIC",
  "FEM-CI",
  "Commercial",
];
const TYPE_OPTIONS = ["Internal", "External", "LinkedIn Learning"];
const CAT_OPTIONS = ["Technical", "Softskills", "Safety"];
const YEAR_OPTIONS = ["2024", "2025", "2026"];
const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ==========================================
// KOMPONEN: FILTER DROPDOWN PREMIUM
// ==========================================
const FilterDropdown = ({
  title,
  options,
  selected,
  onChange,
  colorClass,
  menuColorClass,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (
        window.innerWidth >= 768 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = (e, option) => {
    e.stopPropagation();
    let newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleSelectAll = (e) => {
    e.stopPropagation();
    selected.length === options.length ? onChange([]) : onChange(options);
  };

  const MenuContent = () => (
    <>
      <div
        className={`p-3 md:p-3 ${menuColorClass} text-white cursor-pointer flex items-center justify-between text-[11px] md:text-xs font-bold sticky top-0 shrink-0 shadow-sm`}
        onClick={handleSelectAll}
      >
        <div className="flex items-center gap-3 pointer-events-none">
          <div
            className={`w-4 h-4 rounded border-2 border-white flex items-center justify-center transition-colors ${selected.length === options.length && options.length > 0 ? "bg-white" : "bg-transparent"}`}
          >
            {selected.length === options.length && options.length > 0 && (
              <svg
                className="w-3 h-3 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className="tracking-widest uppercase">Select All</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          className="md:hidden p-1 text-white font-bold px-2 border border-white/30 rounded"
        >
          ✕
        </button>
      </div>
      <div className="overflow-y-auto flex-1 py-1 custom-scrollbar bg-white">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <div
              key={opt}
              className={`group p-3 md:p-2.5 mx-1 my-0.5 rounded-lg cursor-pointer flex items-center gap-3 transition-all ${isSelected ? "bg-blue-50" : "hover:bg-slate-100"}`}
              onClick={(e) => handleToggle(e, opt)}
            >
              <div
                className={`w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center pointer-events-none ${isSelected ? "bg-blue-600 border-blue-600 shadow-sm" : "border-slate-300 bg-white"}`}
              >
                {isSelected && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`text-[11px] md:text-xs font-medium transition-colors pointer-events-none ${isSelected ? "text-blue-800 font-bold" : "text-slate-600"}`}
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div
      ref={dropdownRef}
      className={`relative flex-none w-[160px] md:w-[180px] lg:flex-1 lg:w-auto ${isOpen ? "z-[99999]" : "z-10"}`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${colorClass} transition-all duration-200 text-white rounded-xl flex items-center justify-between p-3 md:p-4 font-bold text-[10px] md:text-xs cursor-pointer shadow-md hover:brightness-110 active:scale-95`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="uppercase tracking-wider truncate">{title}</span>
          {icon && <div className="shrink-0">{icon}</div>}
        </div>
        <span
          className={`text-[10px] transition-transform duration-300 ml-2 shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </div>
      {isOpen && (
        <>
          <div className="hidden md:flex absolute top-full left-0 mt-2 w-60 max-h-72 bg-white rounded-xl shadow-xl z-[99999] flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <MenuContent />
          </div>
          {mounted &&
            createPortal(
              <div className="fixed inset-0 z-[100000] flex items-center justify-center md:hidden pointer-events-auto">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                ></div>
                <div className="relative w-[85vw] max-w-[300px] max-h-[65vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
                  <MenuContent />
                  <div
                    className="p-3.5 bg-slate-50 border-t border-slate-100 text-center text-xs font-bold text-blue-600 active:bg-slate-200 cursor-pointer transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                  >
                    CLOSE MENU
                  </div>
                </div>
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  );
};

// ==========================================
// UPCOMING TRAINING TABLE
// ==========================================
const UpcomingTrainingTable = () => (
  <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-4 flex flex-col h-full min-h-0 overflow-hidden">
    <div className="flex items-center gap-2 mb-3 shrink-0">
      <h3 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
        UPCOMING TRAINING
      </h3>
      <div className="flex gap-1.5">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto rounded-xl border border-slate-100 custom-scrollbar">
      <table className="w-full text-[10px] md:text-[11px] text-left">
        <thead className="bg-[#8b5cf6] text-white sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-2.5 text-center font-bold tracking-wider">Date</th>
            <th className="p-2.5 text-center font-bold tracking-wider">Dept</th>
            <th className="p-2.5 text-center font-bold tracking-wider">
              Training Type
            </th>
            <th className="p-2.5 text-left font-bold tracking-wider">
              Participants
            </th>
          </tr>
        </thead>
        <tbody className="text-slate-700 divide-y divide-slate-100">
          <tr className="hover:bg-slate-50 transition">
            <td className="p-2.5 text-center font-medium">02-05 Mar</td>
            <td className="p-2.5 text-center">FIC</td>
            <td className="p-2.5 text-center">Technical</td>
            <td className="p-2.5 font-medium">Luthfi Dhiya Ulhaq</td>
          </tr>
          <tr className="hover:bg-slate-50 transition">
            <td className="p-2.5 text-center font-medium">02-05 Mar</td>
            <td className="p-2.5 text-center">FIC</td>
            <td className="p-2.5 text-center">Technical</td>
            <td className="p-2.5 font-medium">Eka Pria Utama Mulyana</td>
          </tr>
          <tr className="hover:bg-slate-50 transition">
            <td className="p-2.5 text-center font-medium">1-2 July</td>
            <td className="p-2.5 text-center">FIC</td>
            <td className="p-2.5 text-center">Technical</td>
            <td className="p-2.5 font-medium">Maria Widya Fredlina</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT (PAGE)
// ==========================================
export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [isHome, setIsHome] = useState(true);

  // 🔥 STATE ROLE & LOGIN DENGAN GOOGLE SHEET
  const [userRole, setUserRole] = useState("viewer");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [filters, setFilters] = useState({
    department: [],
    trainingType: [],
    category: [],
    year: [],
    month: [],
  });
  const [genderFilter, setGenderFilter] = useState("All");

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const resetFilters = () => {
    setFilters({
      department: [],
      trainingType: [],
      category: [],
      year: [],
      month: [],
    });
    setGenderFilter("All");
  };

  useEffect(() => {
    setIsMounted(true);
    const scrollContainer = document.getElementById("main-scroll");
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePage(entry.target.id);
          }
        });
      },
      { root: scrollContainer, threshold: 0.5 },
    );

    document
      .querySelectorAll("section[id]")
      .forEach((section) => observer.observe(section));

    const handleScroll = () => {
      const opacity = Math.min(scrollContainer.scrollTop / 100, 1);
      document.documentElement.style.setProperty("--header-opacity", opacity);
      setIsHome(scrollContainer.scrollTop < 50);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    scrollContainer.scrollTop = 0;

    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 🔥 FUNGSI LOGIN DYNAMIC (Google Sheet)
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch(
        "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Admin%20List",
        { cache: "no-store" },
      );
      const currentAdmins = await res.json();

      const match = currentAdmins.find(
        (admin) =>
          admin["Name"] &&
          admin["Name"].toLowerCase().trim() ===
            username.toLowerCase().trim() &&
          String(admin["Password"]) === String(password),
      );

      if (match) {
        setUserRole("admin");
        setShowLoginModal(false);
        setUsername("");
        setPassword("");
      } else {
        setLoginError("Name or password is incorrect!");
      }
    } catch (err) {
      setLoginError("An error occurred while connecting!");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setUserRole("viewer");
  };

  return (
    <div
      id="main-scroll"
      className="w-full overflow-y-auto scroll-smooth relative overscroll-none bg-[#1e3a8a] text-slate-800"
      style={{ height: "100dvh" }}
    >
      <div
        id="top-sentinel"
        className="absolute top-0 left-0 w-full h-0 pointer-events-none z-0"
      ></div>
      <Header
        setMobileOpen={setMobileOpen}
        isHome={isHome}
        resetFilters={resetFilters}
        activePage={activePage}
      />

      {/* 🔥 PASSING STATE KE SIDEBAR */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activePage={activePage}
        setActivePage={setActivePage}
        userRole={userRole}
        setShowLoginModal={setShowLoginModal}
        handleLogout={handleLogout}
      />

      <section
        id="home"
        className="relative w-full flex flex-col items-center justify-center overflow-hidden z-10"
        style={{ height: "100dvh" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/bgvid.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

        <div className="relative z-40 text-center max-w-2xl px-6 text-white pointer-events-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight uppercase tracking-wide">
            CORPORATE TRAINING OVERVIEW
          </h1>
          <button
            onClick={() => scrollToSection("mandays")}
            className="group relative inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-10 py-3.5 md:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            <div className="absolute inset-0 w-full h-full bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="relative z-10 group-hover:text-[#1e3a8a] transition-colors duration-300">
              WATCH NOW
            </span>
            <svg
              className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10 group-hover:text-[#1e3a8a] transition-colors duration-300 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </button>
        </div>
      </section>

      <section
        id="mandays"
        className="bg-[#f1f5f9] px-3 md:px-5 pt-[80px] md:pt-[90px] pb-4 z-20 relative flex flex-col gap-3 md:gap-4"
        style={{ height: "100dvh" }}
      >
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible gap-2 md:gap-3 w-full shrink-0 relative z-[99999] pb-2 [&::-webkit-scrollbar]:hidden">
          <FilterDropdown
            title="DEPARTEMENT"
            options={DEPT_OPTIONS}
            selected={filters.department}
            onChange={(val) => updateFilter("department", val)}
            colorClass="bg-[#0284c7] hover:bg-[#0369a1]"
            menuColorClass="bg-[#0284c7]"
            icon={
              <svg
                className="w-4 h-4 md:w-5 md:h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6h6v-6h4v6h10V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3L11 16.414V20zm8 0h-6v-6H7v-3.586l2-2V4h10v16z" />
                <path d="M11 6h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z" />
              </svg>
            }
          />
          <FilterDropdown
            title="TRAINING TYPE"
            options={TYPE_OPTIONS}
            selected={filters.trainingType}
            onChange={(val) => updateFilter("trainingType", val)}
            colorClass="bg-[#65a30d] hover:bg-[#4d7c0f]"
            menuColorClass="bg-[#65a30d]"
            icon={
              <svg
                className="w-4 h-4 md:w-5 md:h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21H3V3h2v16h16v2zM7 10h4v8H7v-8zm6-4h4v12h-4V6z" />
              </svg>
            }
          />
          <FilterDropdown
            title="TRAINING CATEGORY"
            options={CAT_OPTIONS}
            selected={filters.category}
            onChange={(val) => updateFilter("category", val)}
            colorClass="bg-[#dc2626] hover:bg-[#b91c1c]"
            menuColorClass="bg-[#dc2626]"
            icon={
              <svg
                className="w-4 h-4 md:w-5 md:h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 6h-8l-2-2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2zm0 14H4V8h16v12z" />
              </svg>
            }
          />
          <FilterDropdown
            title="YEAR"
            options={YEAR_OPTIONS}
            selected={filters.year}
            onChange={(val) => updateFilter("year", val)}
            colorClass="bg-[#d97706] hover:bg-[#b45309]"
            menuColorClass="bg-[#d97706]"
            icon={
              <svg
                className="w-4 h-4 md:w-5 md:h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z" />
              </svg>
            }
          />
          <FilterDropdown
            title="MONTH"
            options={MONTH_OPTIONS}
            selected={filters.month}
            onChange={(val) => updateFilter("month", val)}
            colorClass="bg-[#7e22ce] hover:bg-[#6b21a8]"
            menuColorClass="bg-[#7e22ce]"
            icon={
              <svg
                className="w-4 h-4 md:w-5 md:h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z" />
                <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z" />
              </svg>
            }
          />
        </div>
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-3 md:gap-4 min-h-0 overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0 relative z-10">
          <div className="w-full lg:w-[30%] lg:min-w-[280px] lg:max-w-[380px] shrink-0 flex flex-col min-h-[600px] lg:min-h-0">
            <MandaysSummary
              filters={filters}
              genderFilter={genderFilter}
              setGenderFilter={setGenderFilter}
            />
          </div>
          <div className="flex-1 w-full flex flex-col gap-3 md:gap-4 min-w-0">
            <div className="flex-1 flex flex-col min-h-0 relative z-30">
              <TrainingAnalytics
                filters={filters}
                genderFilter={genderFilter}
              />
            </div>

            <div className="h-[250px] lg:h-[35%] lg:min-h-[180px] shrink-0 relative z-20">
              <UpcomingTrainingTable />
            </div>
          </div>
        </div>
      </section>

      <section
        id="training-plan"
        className="bg-[#f1f5f9] pt-[80px] md:pt-[90px] pb-4 px-3 md:px-5 overflow-hidden z-20 relative"
        style={{ height: "100dvh" }}
      >
        <div className="h-full w-full">
          <TrainingPlan filters={filters} />
        </div>
      </section>

      <section
        id="matrix-competency"
        className="bg-[#f1f5f9] pt-[80px] md:pt-[90px] pb-4 px-3 md:px-5 overflow-hidden z-20 relative flex items-center justify-center"
        style={{ height: "100dvh" }}
      >
        <div className="text-center bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full relative overflow-hidden group">
          <div className="relative w-56 h-48 mx-auto flex items-end justify-center mb-8">
            <svg
              className="absolute top-0 left-6 w-32 h-32 text-slate-200"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="2" width="20" height="20" rx="2" fill="#f1f5f9" />
              <rect x="4" y="4" width="4" height="4" fill="#cbd5e1" />
              <rect x="10" y="4" width="4" height="4" fill="#3b82f6" />
              <rect x="16" y="4" width="4" height="4" fill="#cbd5e1" />
              <rect x="4" y="10" width="4" height="4" fill="#ef4444" />
              <rect x="10" y="10" width="4" height="4" fill="#cbd5e1" />
              <rect x="16" y="10" width="4" height="4" fill="#10b981" />
              <rect x="4" y="16" width="4" height="4" fill="#cbd5e1" />
              <rect x="10" y="16" width="4" height="4" fill="#f59e0b" />
              <rect x="16" y="16" width="4" height="4" fill="#cbd5e1" />
            </svg>
            <svg
              className="absolute top-2 right-4 w-12 h-12 text-slate-300 animate-[spin_4s_linear_infinite]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <circle
                cx="12"
                cy="12"
                r="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></circle>
            </svg>
            <div
              className="relative z-10 animate-bounce"
              style={{ animationDuration: "2s" }}
            >
              <svg
                className="w-28 h-28 drop-shadow-xl"
                viewBox="0 0 64 64"
                fill="none"
              >
                <path
                  d="M16 60v-8c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v8"
                  fill="#fb923c"
                />
                <path d="M22 40l-6 20h32l-6-20" fill="#ea580c" />
                <path d="M24 40v20M40 40v20" stroke="#fcd34d" strokeWidth="3" />
                <circle cx="32" cy="24" r="10" fill="#fca5a5" />
                <path
                  d="M32 6c-6.6 0-12 5.4-12 12v2h24v-2c0-6.6-5.4-12-12-12z"
                  fill="#eab308"
                />
                <path d="M18 20h28v4H18z" fill="#ca8a04" />
              </svg>
            </div>
            <div
              className="absolute bottom-2 left-8 z-20 animate-pulse"
              style={{ animationDuration: "1.5s" }}
            >
              <svg
                className="w-14 h-14 text-blue-600 drop-shadow-md"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-800">
            MATRIX COMPETENCY
          </h1>
          <p className="text-slate-400 mt-3 font-bold uppercase tracking-widest text-xs md:text-sm">
            Under Construction
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </section>

      <section
        id="training-calendar"
        className="bg-[#f1f5f9] pt-[80px] md:pt-[90px] pb-4 px-3 md:px-5 overflow-hidden z-20 relative"
        style={{ height: "100dvh" }}
      >
        <div className="h-full w-full">
          <TrainingCalendar userRole={userRole} />
        </div>
      </section>

      {/* ========================================== */}
      {/* 🔥 MODAL LOGIN ADMIN DENGAN VERIFIKASI SHEET */}
      {/* ========================================== */}
      {isMounted &&
        showLoginModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 pointer-events-auto">
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            ></div>
            <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>
              </div>

              <h3 className="text-center font-black text-xl text-slate-800 uppercase tracking-widest mb-1">
                Admin Access
              </h3>
              <p className="text-center text-xs font-bold text-slate-400 mb-6">
                Enter full name & password
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-medium text-slate-700 transition"
                    placeholder="e.g. Intan Kurnia Darsono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 font-medium text-slate-700 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-red-500 text-[10px] font-bold text-center mt-1 bg-red-50 p-2 rounded-lg">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-3 rounded-xl transition shadow-lg shadow-blue-500/30 active:scale-95 disabled:opacity-50"
                >
                  {isLoggingIn ? "Verifying..." : "login"}
                </button>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
