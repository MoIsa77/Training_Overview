"use client";

import { useEffect, useState, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ==========================================
// KOMPONEN: ANIMATED NUMBER (Hitungan Stopwatch)
// ==========================================
const AnimatedNumber = ({ value, duration = 1000, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;
    const targetValue = parseFloat(value) || 0;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeProgress * targetValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animation);
      } else {
        setCount(targetValue);
      }
    };

    setCount(0);
    animationFrame = requestAnimationFrame(animation);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formattedCount =
    decimals > 0
      ? count.toFixed(decimals).replace(".", ",")
      : Math.floor(count);

  return <>{formattedCount}</>;
};

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

  const options = [
    { id: "All", label: "ALL", colorClass: "text-slate-600", icon: "👥" },
    { id: "Male", label: "MALE", colorClass: "text-blue-600", icon: "♂️" },
    { id: "Female", label: "FEMALE", colorClass: "text-pink-600", icon: "♀️" },
  ];

  const current = options.find((o) => o.id === selected) || options[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-50">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 px-3 py-1.5 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-slate-300 transition-all select-none"
      >
        <span
          className={`text-[10px] font-bold ${current.colorClass} tracking-wider`}
        >
          {current.icon} {current.label}
        </span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
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
                className="px-3 py-2 cursor-pointer hover:bg-slate-50 text-[10px] font-bold text-slate-700"
              >
                {opt.icon} {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const summaryRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Summary",
        );
        const summary = await summaryRes.json();
        if (Array.isArray(summary)) {
          const formattedMonth = summary
            .map((row) => ({
              month: row["Month"],
              gaugeTarget: parseFloat(row["Target Mandays"]) || 0,
              tableTarget:
                parseFloat(row["Grand Total Ytd Mandays Target"]) || 0,
              current:
                parseFloat(
                  row["Grand Total Training Mandays / Employees (Ytd)"],
                ) || 0,
            }))
            .filter(
              (row) =>
                row.month && !row.month.toLowerCase().includes("grand total"),
            );
          setMonthlyData(formattedMonth);
        }

        const deptRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Summary%20per%20Dept",
        );
        const deptJson = await deptRes.json();
        if (Array.isArray(deptJson)) {
          setDeptData(
            deptJson.map((row) => ({
              dept: row[Object.keys(row)[1]],
              mandays: parseFloat(row[Object.keys(row)[4]]) || 0,
            })),
          );
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

  // Filter Gender Logic (Hanya satu bulan)
  useEffect(() => {
    if (!participants.length) return;
    const filtered = participants.filter((row) => {
      const month = normalize(row["Month"]);
      const dept = normalize(row["Department"] || row["Dept"]);
      if (filters?.month?.length > 0 && normalize(filters.month[0]) !== month)
        return false;
      if (
        filters?.department?.length > 0 &&
        !filters.department.some((d) => normalize(d) === dept)
      )
        return false;
      return true;
    });
    const map = new Map();
    filtered.forEach((row) => {
      const name = (row["Participants"] || "").trim();
      if (name && !map.has(name)) map.set(name, normalize(row["Gender"]));
    });
    let male = 0;
    let female = 0;
    map.forEach((g) => {
      if (["male", "l", "m", "laki-laki"].includes(g)) male++;
      if (["female", "p", "f", "perempuan"].includes(g)) female++;
    });
    setGenderCounts({ male, female });
  }, [participants, filters]);

  // 🔥 LOGIKA SINGLE MONTH SELECTION 🔥
  let activeMonthData = null;
  const currentRealMonth = new Date()
    .toLocaleString("en-US", { month: "long" })
    .toLowerCase();

  if (filters?.month && filters.month.length > 0) {
    // Jika user pilih bulan di filter (Single Select)
    activeMonthData = monthlyData.find(
      (m) => normalize(m.month) === normalize(filters.month[0]),
    );
  } else if (monthlyData.length > 0) {
    // Jika ALL, otomatis cari bulan sekarang
    activeMonthData =
      monthlyData.find((m) => normalize(m.month) === currentRealMonth) ||
      monthlyData[0];
  }

  const targetValue = 5.7;
  const currentVal = activeMonthData?.current || 0;
  const percent = targetValue > 0 ? currentVal / targetValue : 0;

  const gaugeData = [
    { name: "Current", value: currentVal },
    { name: "Remaining", value: Math.max(targetValue - currentVal, 0) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-3 h-full flex flex-col gap-3 overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <div className="bg-[#2563eb] w-6 h-6 rounded flex items-center justify-center text-white text-[10px]">
            👤
          </div>
          <span className="text-[11px] tracking-wider uppercase">
            TRAINING MANDAYS
          </span>
        </div>
        <GenderDropdown
          selected={genderFilter || "All"}
          onChange={(val) => setGenderFilter(val)}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-2">
          <span className="text-[8px] font-bold text-blue-600 uppercase block">
            Male
          </span>
          <span className="text-xl font-black text-blue-900">
            <AnimatedNumber value={genderCounts.male} />
          </span>
        </div>
        <div className="flex-1 bg-pink-50 border border-pink-100 rounded-xl p-2">
          <span className="text-[8px] font-bold text-pink-600 uppercase block">
            Female
          </span>
          <span className="text-xl font-black text-pink-900">
            <AnimatedNumber value={genderCounts.female} />
          </span>
        </div>
      </div>

      {/* GAUGE SECTION */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 relative z-0">
        <div className="relative w-[55%] flex flex-col justify-end">
          <ResponsiveContainer width="100%" aspect={2.2}>
            <PieChart>
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
                <Cell fill="#dc2626" />
                <Cell fill="#fbcfe8" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
            <span className="text-[10px] font-black text-slate-600 uppercase">
              {isLoading ? (
                "..."
              ) : (
                <>
                  <AnimatedNumber value={Math.round(percent * 100)} />% Achieved
                </>
              )}
            </span>
          </div>
        </div>
        <div className="w-[45%] flex flex-col justify-center gap-2 bg-white border border-slate-100 rounded-lg p-2 shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 uppercase">
              Target
            </span>
            <span className="text-xs font-bold text-slate-700">5,70</span>
          </div>
          <div className="w-full h-px bg-slate-100"></div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 uppercase">
              Current ({activeMonthData?.month || "..."})
            </span>
            <span className="text-lg font-black text-[#2563eb] leading-none">
              {isLoading ? (
                "..."
              ) : (
                <AnimatedNumber value={currentVal} decimals={2} />
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-rows-2 gap-2">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-y-auto h-full custom-scrollbar">
            <table className="w-full text-slate-700 text-[10px]">
              <thead className="bg-[#16a34a] text-white sticky top-0">
                <tr>
                  <th className="p-1.5 text-left">Month</th>
                  <th className="text-center">Target</th>
                  <th className="text-center">Current</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyData.map((row, i) => (
                  <tr
                    key={i}
                    className={`transition-colors ${normalize(row.month) === normalize(activeMonthData?.month) ? "bg-blue-50 font-bold text-blue-700" : "hover:bg-slate-50"}`}
                  >
                    <td className="p-1.5">{row.month}</td>
                    <td className="text-center">
                      {formatNumber(row.tableTarget)}
                    </td>
                    <td className="text-center">{formatNumber(row.current)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-y-auto h-full custom-scrollbar">
            <table className="w-full text-slate-700 text-[10px]">
              <thead className="bg-[#2563eb] text-white sticky top-0">
                <tr>
                  <th className="p-1.5 text-left">Dept</th>
                  <th className="text-center">Mandays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deptData.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-1.5">{row.dept}</td>
                    <td className="text-center">{formatNumber(row.mandays)}</td>
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
