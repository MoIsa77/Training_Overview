"use client";

import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ==========================================
// KOMPONEN: CUSTOM GENDER DROPDOWN
// ==========================================
const GenderDropdown = ({ selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // 🔥 FIX: Ikon Gender diganti pakai SVG dengan Stroke-Width tebal (4)
  const options = [
    {
      id: "All",
      label: "ALL",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      ),
      colorClass: "text-slate-600",
      bgHover: "hover:bg-slate-100",
    },
    {
      id: "Male",
      label: "MALE",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 3.75h5.25v5.25M21 3.75l-7.5 7.5M15 15a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      ),
      colorClass: "text-blue-600",
      bgHover: "hover:bg-blue-50",
    },
    {
      id: "Female",
      label: "FEMALE",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v6M9 18h6M18 9a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      ),
      colorClass: "text-pink-600",
      bgHover: "hover:bg-pink-50",
    },
  ];

  const current = options.find((o) => o.id === selected) || options[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-3 py-1.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all select-none"
      >
        <div className="flex items-center gap-1.5">
          <div
            className={`${current.colorClass} flex items-center justify-center`}
          >
            {current.icon}
          </div>
          <span
            className={`text-[10px] font-bold ${current.colorClass} tracking-wider`}
          >
            {current.label}
          </span>
        </div>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          <div className="py-1">
            {options.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${selected === opt.id ? "bg-slate-50" : "bg-white"} ${opt.bgHover}`}
              >
                <div
                  className={`${opt.colorClass} flex items-center justify-center`}
                >
                  {opt.icon}
                </div>
                <span
                  className={`text-[10px] font-bold ${opt.colorClass} tracking-wider`}
                >
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: MANDAYS SUMMARY
// ==========================================
export default function MandaysSummary({
  filters = {},
  genderFilter,
  setGenderFilter,
}) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });

  const formatNumber = (val) => {
    if (val === null || val === undefined || val === "" || isNaN(val))
      return "-";
    return parseFloat(val).toFixed(2).replace(".", ",");
  };

  const normalize = (val) => (val || "").toString().toLowerCase().trim();

  // ================= FETCH DATA =================
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const summaryRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Summary",
        );
        const summary = await summaryRes.json();
        if (Array.isArray(summary)) {
          const formattedMonth = summary.map((row) => ({
            month: row["Month"],
            gaugeTarget: parseFloat(row["Target Mandays"]) || 0,
            tableTarget: parseFloat(row["Grand Total Ytd Mandays Target"]) || 0,
            current: parseFloat(row["Current"]) || 0,
          }));
          setMonthlyData(formattedMonth);
        }

        const deptRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Summary%20per%20Dept",
        );
        const deptJson = await deptRes.json();
        if (Array.isArray(deptJson)) {
          const formattedDept = deptJson.map((row) => {
            const keys = Object.keys(row);
            return {
              dept: row[keys[1]],
              mandays: parseFloat(row[keys[4]]) || 0,
            };
          });
          setDeptData(formattedDept);
        }

        const genderRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Main",
        );
        const genderJson = await genderRes.json();
        if (Array.isArray(genderJson)) setParticipants(genderJson);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // ================= FILTER LOGIC =================
  useEffect(() => {
    if (!participants.length) return;

    const filtered = participants.filter((row) => {
      const month = normalize(row["Month"]);
      const dept = normalize(row["Department"] || row["Dept"]);
      const type = normalize(row["Training Type"] || row["TrainingType"]);
      const category = normalize(row["Training Category"] || row["Category"]);

      if (
        filters?.month?.length > 0 &&
        !filters.month.some((m) => normalize(m) === month)
      )
        return false;
      if (
        filters?.department?.length > 0 &&
        !filters.department.some((d) => normalize(d) === dept)
      )
        return false;
      if (
        filters?.trainingType?.length > 0 &&
        !filters.trainingType.some((t) => normalize(t) === type)
      )
        return false;
      if (
        filters?.category?.length > 0 &&
        !filters.category.some((c) => normalize(c) === category)
      )
        return false;

      return true;
    });

    const map = new Map();
    filtered.forEach((row) => {
      const name = (row["Participants"] || "").trim();
      const gender = normalize(row["Gender"]);
      if (!name) return;
      if (!map.has(name)) map.set(name, gender);
    });

    let male = 0;
    let female = 0;
    map.forEach((g) => {
      if (g === "male" || g === "laki-laki" || g === "l" || g === "m") male++;
      if (g === "female" || g === "perempuan" || g === "p" || g === "f")
        female++;
    });

    setGenderCounts({ male, female });
  }, [participants, filters]);

  let gaugeMonthData = [];
  if (filters?.month && filters.month.length > 0) {
    gaugeMonthData = monthlyData.filter((m) =>
      filters.month.some(
        (selected) =>
          selected.toLowerCase().trim() === m.month?.toLowerCase().trim(),
      ),
    );
  } else if (monthlyData.length > 0) {
    gaugeMonthData = [monthlyData[0]];
  }

  const totalTarget = gaugeMonthData.reduce(
    (sum, row) => sum + row.gaugeTarget,
    0,
  );
  const totalCurrent = gaugeMonthData.reduce(
    (sum, row) => sum + row.current,
    0,
  );
  const percent = totalTarget > 0 ? totalCurrent / totalTarget : 0;

  const gaugeData = [
    { name: "Current", value: totalCurrent },
    { name: "Remaining", value: Math.max(totalTarget - totalCurrent, 0) },
  ];

  const filteredDept = deptData.filter((d) => {
    if (filters?.department && filters.department.length > 0) {
      return filters.department.some(
        (selected) =>
          selected.toLowerCase().trim() === d.dept?.toLowerCase().trim(),
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-3 h-full flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center gap-2 font-bold text-slate-800 shrink-0 border-b border-slate-100 pb-2 relative z-0">
        <div className="bg-[#2563eb] w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">
          👤
        </div>
        <span className="text-sm tracking-wide">TRAINING MANDAYS</span>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Gender Distribution
          </span>

          {/* CUSTOM DROPDOWN */}
          <GenderDropdown
            selected={genderFilter || "All"}
            onChange={(val) => setGenderFilter && setGenderFilter(val)}
          />
        </div>

        <div className="flex gap-2 w-full transition-all duration-300 relative z-0">
          {(genderFilter === "All" || genderFilter === "Male") && (
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-2 flex flex-col justify-center relative overflow-hidden animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center gap-2 mb-1">
                {/* 🔥 Ikon SVG Tebal untuk Male */}
                <div className="bg-blue-500 w-5 h-5 rounded flex items-center justify-center text-white shadow-sm z-10">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 3.75h5.25v5.25M21 3.75l-7.5 7.5M15 15a6 6 0 11-12 0 6 6 0 0112 0z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-blue-600 z-10">
                  MALE
                </span>
              </div>
              <span className="text-xl font-black text-blue-900 z-10">
                {isLoading ? "..." : genderCounts.male}
              </span>
              {/* Background SVG Tebal Male */}
              <div className="absolute -bottom-4 -right-4 z-0 text-blue-500 opacity-5">
                <svg
                  className="w-20 h-20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 3.75h5.25v5.25M21 3.75l-7.5 7.5M15 15a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>
            </div>
          )}

          {(genderFilter === "All" || genderFilter === "Female") && (
            <div className="flex-1 bg-pink-50 border border-pink-100 rounded-xl p-2 flex flex-col justify-center relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-1">
                {/* 🔥 Ikon SVG Tebal untuk Female */}
                <div className="bg-pink-400 w-5 h-5 rounded flex items-center justify-center text-white shadow-sm z-10">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v6M9 18h6M18 9a6 6 0 11-12 0 6 6 0 0112 0z"
                    />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-pink-600 z-10">
                  FEMALE
                </span>
              </div>
              <span className="text-xl font-black text-pink-900 z-10">
                {isLoading ? "..." : genderCounts.female}
              </span>
              {/* Background SVG Tebal Female */}
              <div className="absolute -bottom-4 -right-4 z-0 text-pink-500 opacity-5">
                <svg
                  className="w-20 h-20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v6M9 18h6M18 9a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0 flex items-center gap-3 relative z-0">
        <div className="relative w-[60%] flex flex-col justify-end">
          <ResponsiveContainer width="100%" aspect={2}>
            <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={gaugeData}
                startAngle={180}
                endAngle={0}
                cy="100%"
                innerRadius="130%"
                outerRadius="180%"
                dataKey="value"
                stroke="none"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={index} fill={["#dc2626", "#f8cdd1"][index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pointer-events-none pb-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {Math.round(percent * 100)}% Achieved
            </div>
          </div>
        </div>
        <div className="w-[40%] flex flex-col justify-center gap-3 bg-white border border-slate-100 rounded-lg p-3 shadow-sm h-full min-h-[100px]">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Target
            </span>
            <span className="text-sm font-bold text-slate-700">
              {formatNumber(totalTarget)}
            </span>
          </div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Current
            </span>
            <span className="text-lg font-black text-[#2563eb] leading-none">
              {formatNumber(totalCurrent)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-rows-2 gap-2 mt-1 relative z-0">
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-sm">
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-slate-700 text-[11px]">
              <thead className="bg-[#16a34a] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-1.5 text-left font-semibold">Month</th>
                  <th className="font-semibold text-center">Target</th>
                  <th className="font-semibold text-center">Current</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-1.5">{row.month}</td>
                    <td className="text-center font-medium">
                      {formatNumber(row.tableTarget)}
                    </td>
                    <td className="text-center font-medium">
                      {formatNumber(row.current)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-sm">
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            <table className="w-full text-slate-700 text-[11px]">
              <thead className="bg-[#2563eb] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-1.5 text-left font-semibold">Dept</th>
                  <th className="font-semibold text-center">Mandays</th>
                </tr>
              </thead>
              <tbody>
                {filteredDept.slice(0, 10).map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-1.5">{row.dept}</td>
                    <td className="text-center font-medium">
                      {formatNumber(row.mandays)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
