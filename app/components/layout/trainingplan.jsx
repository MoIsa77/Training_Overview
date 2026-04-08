"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Data Opsi Filter
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

// ==========================================
// KOMPONEN: FILTER DROPDOWN
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
      className={`relative flex-none lg:flex-1 ${isOpen ? "z-[99999]" : "z-10"}`}
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
// MAIN COMPONENT: TRAINING PLAN
// ==========================================
export default function TrainingPlan() {
  const [localFilters, setLocalFilters] = useState({
    department: [],
    trainingType: [],
  });

  // Data Dummy
  const initialPlannedData = [
    {
      dept: "Operation",
      title: "Management Spare Part",
      type: "External",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Neo Matrix - Vigilant Training",
      type: "Internal",
      status: "TBC",
    },
    {
      dept: "FIC",
      title: "Camera Detection Capsule",
      type: "Internal",
      status: "TBC",
    },
    {
      dept: "QA",
      title: "Solidwork Training with CMM",
      type: "External",
      status: "TBC",
    },
    { dept: "HSE", title: "Energy Audit", type: "External", status: "TBC" },
    {
      dept: "HSE",
      title: "Manager Energy - BNSP",
      type: "External",
      status: "TBC",
    },
    {
      dept: "QA",
      title: "Refresh training for Basic QA & Visual defect",
      type: "Internal",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Refresh Basic Knowledge of Prod. Machine",
      type: "Internal",
      status: "TBC",
    },
  ];

  const initialAdHocData = [
    {
      dept: "QA",
      title: "How to Network When You Don't Like Networking",
      type: "Internal",
      status: "Complete",
    },
    {
      dept: "QA",
      title: "Characteristics of a Great Scrum Master",
      type: "External",
      status: "Complete",
    },
    {
      dept: "HR",
      title: "Transform Your Days with Strategic Time Blocking",
      type: "Internal",
      status: "Complete",
    },
    {
      dept: "HR",
      title: "Hire Better. Hire Faster with Social Media",
      type: "External",
      status: "Complete",
    },
    {
      dept: "FIC",
      title: "The Four Tendencies: How to Build Better Habits",
      type: "Internal",
      status: "Complete",
    },
    {
      dept: "FIC",
      title: "AI Prompts for Deep Research",
      type: "External",
      status: "Complete",
    },
    {
      dept: "Supply Chain",
      title: "Uncertainty to Action: Starting AI Learning",
      type: "Internal",
      status: "Complete",
    },
  ];

  // Mesin Filter Otomatis
  const filteredPlanned = useMemo(() => {
    return initialPlannedData.filter((row) => {
      const matchDept =
        localFilters.department.length === 0 ||
        localFilters.department.includes(row.dept);
      const matchType =
        localFilters.trainingType.length === 0 ||
        localFilters.trainingType.includes(row.type);
      return matchDept && matchType;
    });
  }, [localFilters]);

  const filteredAdHoc = useMemo(() => {
    return initialAdHocData.filter((row) => {
      const matchDept =
        localFilters.department.length === 0 ||
        localFilters.department.includes(row.dept);
      const matchType =
        localFilters.trainingType.length === 0 ||
        localFilters.trainingType.includes(row.type);
      return matchDept && matchType;
    });
  }, [localFilters]);

  // Kalkulasi Chart
  const totalPlanned = filteredPlanned.length;
  const totalAdHoc = filteredAdHoc.length;
  const total = totalPlanned + totalAdHoc;

  const chartData =
    total === 0
      ? []
      : [
          {
            name: "Planned",
            value: Number(((totalPlanned / total) * 100).toFixed(1)),
          },
          {
            name: "Ad Hoc",
            value: Number(((totalAdHoc / total) * 100).toFixed(1)),
          },
        ];
  const COLORS = ["#3b82f6", "#8b5cf6"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    if (percent === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="h-full w-full flex flex-col gap-3 md:gap-4 p-3 md:p-4 font-sans bg-transparent">
      {/* ================= KIRI: TABEL ================= */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4 w-full h-full min-h-0">
        <div className="flex-[1.5] flex flex-col gap-3 md:gap-4 min-w-0">
          {/* TABEL PLANNED TRAINING */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col min-h-[350px] lg:min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
                PLANNED TRAINING ({totalPlanned})
              </h2>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>

            <div className="flex-1 overflow-auto border border-slate-100 rounded-lg custom-scrollbar">
              <table className="w-full min-w-[500px] text-[10px] md:text-[11px] text-left">
                <thead className="bg-[#2563eb] text-white sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-2 font-bold">Dept</th>
                    <th className="p-2 font-bold">Training Title</th>
                    <th className="p-2 font-bold">Type of Training</th>
                    <th className="p-2 font-bold">Status Label</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  {filteredPlanned.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 font-bold text-slate-400"
                      >
                        No matching training found
                      </td>
                    </tr>
                  ) : (
                    filteredPlanned.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-2 font-medium">{row.dept}</td>
                        <td className="p-2 truncate max-w-[200px]">
                          {row.title}
                        </td>
                        <td className="p-2">{row.type}</td>
                        <td className="p-2">{row.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL AD HOC TRAINING */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col min-h-[350px] lg:min-h-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
                AD HOC TRAINING ({totalAdHoc})
              </h2>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>

            <div className="flex-1 overflow-auto border border-slate-100 rounded-lg custom-scrollbar">
              <table className="w-full min-w-[500px] text-[10px] md:text-[11px] text-left">
                <thead className="bg-[#8b5cf6] text-white sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-2 font-bold w-[15%]">Dept</th>
                    <th className="p-2 font-bold w-[50%]">Training Title</th>
                    <th className="p-2 font-bold w-[35%]">Status Label</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 divide-y divide-slate-100">
                  {filteredAdHoc.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 font-bold text-slate-400"
                      >
                        No matching training found
                      </td>
                    </tr>
                  ) : (
                    filteredAdHoc.map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="p-2 font-medium">{row.dept}</td>
                        <td className="p-2 truncate max-w-[250px]">
                          {row.title}
                        </td>
                        <td className="p-2">{row.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= KANAN: FILTERS & CHART ================= */}
        <div className="w-full lg:w-[35%] flex flex-col gap-3 md:gap-4 shrink-0 min-h-0">
          {/* TOMBOL FILTER */}
          <div className="flex gap-2 md:gap-3 shrink-0">
            <FilterDropdown
              title="DEPARTEMENT"
              options={DEPT_OPTIONS}
              selected={localFilters.department}
              onChange={(val) =>
                setLocalFilters({ ...localFilters, department: val })
              }
              colorClass="bg-[#0284c7] hover:bg-[#0369a1]"
              menuColorClass="bg-[#0284c7]"
              icon={
                <svg
                  className="w-4 h-4 opacity-90"
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
              selected={localFilters.trainingType}
              onChange={(val) =>
                setLocalFilters({ ...localFilters, trainingType: val })
              }
              colorClass="bg-[#84cc16] hover:bg-[#65a30d]"
              menuColorClass="bg-[#84cc16]"
              icon={
                <svg
                  className="w-4 h-4 opacity-90"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21H3V3h2v16h16v2zM7 10h4v8H7v-8zm6-4h4v12h-4V6z" />
                </svg>
              }
            />
          </div>

          {/* DONUT CHART */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-4 flex flex-col overflow-hidden min-h-[350px] lg:min-h-0 relative">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
                PLANNED VS AD HOC TRAINING
              </h2>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>

            <div className="flex-1 min-h-0 relative bg-slate-50/50 rounded-xl p-2 border border-slate-100">
              {chartData.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-400">
                  Data Kosong
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="50%"
                      outerRadius="85%"
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={4}
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#ccc",
                        color: "#0f172a",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#1e293b",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
