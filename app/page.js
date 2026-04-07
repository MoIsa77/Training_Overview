"use client";

import { useState, useEffect, useRef } from "react";
import Header from "./components/layout/header";
import Sidebar from "./components/layout/sidebar";
import TrainingAnalytics from "./components/layout/traininganalytics";
import MandaysSummary from "./components/layout/mandayssummary";
import TrainingPlan from "./components/layout/trainingplan";
import TrainingCalendar from "./components/layout/trainingcalendar";

// ==========================================
// DATA OPTIONS UNTUK FILTER
// ==========================================
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
const TYPE_OPTIONS = ["Internal", "External"];
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
// KOMPONEN: FILTER DROPDOWN (PREMIUM & AUTO-CLOSE)
// ==========================================
const FilterDropdown = ({
  title,
  options,
  selected,
  onChange,
  colorClass,
  menuColorClass,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup otomatis saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggle = (option) => {
    let newSelected;
    if (selected.includes(option)) {
      newSelected = selected.filter((item) => item !== option);
    } else {
      newSelected = [...selected, option];
    }
    onChange(newSelected);

    // 🔥 AUTO-CLOSE: Langsung tutup otomatis setelah milih opsi
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options);
    }
    // Note: Untuk Select All kita tidak tutup otomatis agar user bisa melihat semua tercentang
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative flex-none w-[140px] lg:flex-1 lg:w-auto ${isOpen ? "z-[9999]" : "z-10"}`}
    >
      {/* Tombol Utama */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`${colorClass} transition-all duration-200 text-white h-9 md:h-10 rounded-xl flex items-center justify-between px-3 md:px-4 font-bold text-[9px] md:text-[11px] cursor-pointer shadow-lg hover:brightness-110 active:scale-95`}
      >
        <span className="truncate mr-1 uppercase tracking-wider">{title}</span>
        <span
          className={`text-[9px] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <>
          {/* Backdrop Gelap Khusus HP */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9998] md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu Dropdown */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[300px] max-h-[65vh] bg-white rounded-2xl shadow-2xl z-[9999] flex flex-col overflow-hidden md:absolute md:top-full md:left-0 md:mt-2 md:w-60 md:max-h-72 md:translate-x-0 md:translate-y-0 md:rounded-xl border border-slate-100">
            {/* Header Menu / Select All */}
            <div
              className={`p-3 md:p-3 ${menuColorClass} text-white cursor-pointer flex items-center justify-between text-[11px] md:text-xs font-bold sticky top-0 shrink-0 shadow-sm`}
              onClick={handleSelectAll}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border-2 border-white flex items-center justify-center transition-colors ${selected.length === options.length && options.length > 0 ? "bg-white" : "bg-transparent"}`}
                >
                  {selected.length === options.length && options.length > 0 && (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "inherit", filter: "brightness(0.5)" }}
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
                className="md:hidden p-1"
              >
                ✕
              </button>
            </div>

            {/* List Item dengan Hover Effect & Checkbox Premium */}
            <div className="overflow-y-auto flex-1 py-1 custom-scrollbar bg-white">
              {options.map((opt) => {
                const isSelected = selected.includes(opt);
                return (
                  <div
                    key={opt}
                    className={`group p-3 md:p-2.5 mx-1 my-0.5 rounded-lg cursor-pointer flex items-center gap-3 transition-all ${isSelected ? "bg-blue-50" : "hover:bg-slate-100"}`}
                    onClick={() => handleToggle(opt)}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border-2 transition-all flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600 shadow-sm" : "border-slate-300 bg-white group-hover:border-blue-400"}`}
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
                      className={`text-[11px] md:text-xs font-medium transition-colors ${isSelected ? "text-blue-800 font-bold" : "text-slate-600"}`}
                    >
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Tombol Bawah HP */}
            <div
              className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs font-bold text-blue-600 md:hidden active:bg-slate-100 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              CLOSE MENU
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

// ==========================================
// KOMPONEN: TABEL UPCOMING TRAINING
// ==========================================
const UpcomingTrainingTable = () => (
  <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-3 flex flex-col h-full min-h-0 overflow-hidden">
    <h3 className="font-bold text-slate-800 mb-2 shrink-0 text-xs uppercase tracking-wider">
      UPCOMING TRAINING
    </h3>
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-[10px] md:text-[11px] text-left">
        <thead className="bg-[#8b5cf6] text-white sticky top-0 z-10">
          <tr>
            <th className="p-1.5 text-center border-b border-purple-400 min-w-[70px]">
              Date
            </th>
            <th className="p-1.5 text-center border-b border-purple-400 min-w-[70px]">
              Dept
            </th>
            <th className="p-1.5 text-center border-b border-purple-400 min-w-[90px]">
              Training Type
            </th>
            <th className="p-1.5 text-left border-b border-purple-400 min-w-[120px]">
              Participants
            </th>
          </tr>
        </thead>
        <tbody className="text-slate-700">
          <tr className="border-b border-slate-200 bg-purple-50 hover:bg-purple-100 transition">
            <td className="p-1.5 text-center">02-05 Mar</td>
            <td className="text-center">FIC</td>
            <td className="text-center">Technical</td>
            <td className="p-1.5">Luthfi Dhiya Ulhaq</td>
          </tr>
          <tr className="border-b border-slate-200 hover:bg-slate-50 transition">
            <td className="p-1.5 text-center">02-05 Mar</td>
            <td className="text-center">FIC</td>
            <td className="text-center">Technical</td>
            <td className="p-1.5">Eka Pria Utama Mulyana</td>
          </tr>
          <tr className="border-b border-slate-200 bg-purple-50 hover:bg-purple-100 transition">
            <td className="p-1.5 text-center">1-2 July</td>
            <td className="text-center">FIC</td>
            <td className="text-center">Technical</td>
            <td className="p-1.5">Maria Widya Fredlina</td>
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

  const [filters, setFilters] = useState({
    department: [],
    trainingType: [],
    category: [],
    year: [],
    month: [],
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      department: [],
      trainingType: [],
      category: [],
      year: [],
      month: [],
    });
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight } = e.target;
    setIsHome(scrollTop < 50);

    if (scrollTop < clientHeight / 2) {
      if (activePage !== "home") setActivePage("home");
    } else if (scrollTop < clientHeight * 1.5) {
      if (activePage !== "mandays") setActivePage("mandays");
    } else if (scrollTop < clientHeight * 2.5) {
      if (activePage !== "training-plan") setActivePage("training-plan");
    } else {
      if (activePage !== "training-calendar")
        setActivePage("training-calendar");
    }
  };

  const scrollToSection = (id) => {
    const container = document.getElementById("main-scroll");
    const el = document.getElementById(id);
    if (container && el) {
      container.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <div
      id="main-scroll"
      onScroll={handleScroll}
      className="w-full overflow-y-auto snap-y snap-mandatory scroll-smooth relative overscroll-none bg-[#1e3a8a] text-slate-800"
      style={{ height: "100dvh" }}
    >
      <div
        id="top-sentinel"
        className="absolute top-0 left-0 w-full h-[1px] pointer-events-none z-0"
      ></div>

      <Header
        setMobileOpen={setMobileOpen}
        isHome={isHome}
        resetFilters={resetFilters}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* HOME */}
      <section
        id="home"
        className="relative w-full snap-start flex flex-col items-center justify-center bg-cover bg-center z-10"
        style={{ height: "100dvh", backgroundImage: "url('/bg_H.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div className="relative z-40 text-center max-w-2xl px-6 text-white pointer-events-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            CORPORATE TRAINING OVERVIEW
          </h1>
          <button
            onClick={() => scrollToSection("mandays")}
            className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            WATCH NOW ↓
          </button>
        </div>
      </section>

      {/* DASHBOARD */}
      <section
        id="mandays"
        className="snap-start bg-[#f1f5f9] px-3 md:px-4 pt-[56px] md:pt-[64px] pb-3 md:pb-4 z-20 relative flex flex-col gap-2 md:gap-3"
        style={{ height: "100dvh" }}
      >
        {/* FILTER BAR */}
        <div className="flex flex-nowrap overflow-x-auto lg:overflow-visible gap-2 w-full shrink-0 relative z-[100] pb-1 [&::-webkit-scrollbar]:hidden">
          <FilterDropdown
            title="DEPARTEMENT"
            options={DEPT_OPTIONS}
            selected={filters.department}
            onChange={(val) => updateFilter("department", val)}
            colorClass="bg-[#0284c7] hover:bg-[#0369a1]"
            menuColorClass="bg-[#0284c7]"
          />
          <FilterDropdown
            title="TRAINING TYPE"
            options={TYPE_OPTIONS}
            selected={filters.trainingType}
            onChange={(val) => updateFilter("trainingType", val)}
            colorClass="bg-[#65a30d] hover:bg-[#4d7c0f]"
            menuColorClass="bg-[#65a30d]"
          />
          <FilterDropdown
            title="TRAINING CATEGORY"
            options={CAT_OPTIONS}
            selected={filters.category}
            onChange={(val) => updateFilter("category", val)}
            colorClass="bg-[#dc2626] hover:bg-[#b91c1c]"
            menuColorClass="bg-[#dc2626]"
          />
          <FilterDropdown
            title="YEAR"
            options={YEAR_OPTIONS}
            selected={filters.year}
            onChange={(val) => updateFilter("year", val)}
            colorClass="bg-[#d97706] hover:bg-[#b45309]"
            menuColorClass="bg-[#d97706]"
          />
          <FilterDropdown
            title="MONTH"
            options={MONTH_OPTIONS}
            selected={filters.month}
            onChange={(val) => updateFilter("month", val)}
            colorClass="bg-[#7e22ce] hover:bg-[#6b21a8]"
            menuColorClass="bg-[#7e22ce]"
          />
        </div>

        <div className="flex-1 w-full flex flex-col lg:flex-row gap-3 min-h-0 overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0 relative z-10">
          <div className="w-full lg:w-[30%] lg:min-w-[280px] lg:max-w-[380px] shrink-0 flex flex-col min-h-[600px] lg:min-h-0">
            <MandaysSummary filters={filters} />
          </div>
          <div className="flex-1 w-full flex flex-col gap-3 min-w-0">
            <div className="flex-1 flex flex-col min-h-0 relative z-30">
              <TrainingAnalytics filters={filters} />
            </div>
            <div className="h-[250px] lg:h-[35%] lg:min-h-[180px] shrink-0 relative z-20">
              <UpcomingTrainingTable />
            </div>
          </div>
        </div>
      </section>

      {/* PLAN & CALENDAR */}
      <section
        id="training-plan"
        className="snap-start bg-[#f1f5f9] pt-[56px] md:pt-[64px] pb-4 overflow-hidden z-20 relative"
        style={{ height: "100dvh" }}
      >
        <div className="h-full w-full">
          {/* 🔥 Filters diteruskan ke TrainingPlan */}
          <TrainingPlan filters={filters} />
        </div>
      </section>
      <section
        id="training-calendar"
        className="snap-start bg-[#f1f5f9] pt-[56px] md:pt-[64px] pb-4 overflow-hidden z-20 relative"
        style={{ height: "100dvh" }}
      >
        <div className="h-full w-full">
          <TrainingCalendar />
        </div>
      </section>
    </div>
  );
}
