"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function MandaysSummary({ filters = {} }) {
  const [monthlyData, setMonthlyData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [genderCounts, setGenderCounts] = useState({
    male: 0,
    female: 0,
  });

  const [genderFilter, setGenderFilter] = useState("All");

  const formatNumber = (val) => {
    if (val === null || val === undefined || val === "") return "-";
    return parseFloat(val).toFixed(2).replace(".", ",");
  };

  const normalize = (val) => (val || "").toString().toLowerCase().trim();

  // ================= FETCH DATA =================
  useEffect(() => {
    async function fetchData() {
      try {
        const summaryRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Summary",
        );
        const summary = await summaryRes.json();

        const formattedMonth = summary.map((row) => ({
          month: row["Month"],
          gaugeTarget: parseFloat(row["Target Mandays"]) || 0,
          tableTarget: parseFloat(row["Grand Total Ytd Mandays Target"]) || 0,
          current: parseFloat(row["Current"]) || 0,
        }));

        setMonthlyData(formattedMonth);

        const deptRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Summary%20per%20Dept",
        );
        const deptJson = await deptRes.json();

        const formattedDept = deptJson.map((row) => {
          const keys = Object.keys(row);
          return {
            dept: row[keys[1]],
            mandays: parseFloat(row[keys[4]]) || 0,
          };
        });

        setDeptData(formattedDept);

        const genderRes = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Main",
        );
        const genderJson = await genderRes.json();

        setParticipants(genderJson);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  // ================= GENDER COUNT =================
  useEffect(() => {
    if (!participants.length) return;

    const filtered = participants.filter((row) => {
      const month = normalize(row["Month"]);
      const dept = normalize(row["Department"] || row["Dept"]);
      const type = normalize(row["Training Type"] || row["TrainingType"]);
      const category = normalize(row["Category"]);

      // 🔥 PERBAIKAN: Mengecek data di dalam Array menggunakan .some()
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
      if (g === "male") male++;
      if (g === "female") female++;
    });

    setGenderCounts({ male, female });
  }, [participants, filters]);

  // ================= GAUGE =================
  // 🔥 PERBAIKAN: Gauge sekarang bisa mengakumulasi lebih dari 1 bulan jika dipilih banyak
  let gaugeMonthData = [];
  if (filters?.month && filters.month.length > 0) {
    gaugeMonthData = monthlyData.filter((m) =>
      filters.month.some(
        (selected) =>
          selected.toLowerCase().trim() === m.month?.toLowerCase().trim(),
      ),
    );
  } else if (monthlyData.length > 0) {
    // Default ke bulan pertama jika tidak ada filter bulan yang dicentang
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
    {
      name: "Remaining",
      value: Math.max(totalTarget - totalCurrent, 0),
    },
  ];

  const COLORS = ["#dc2626", "#f8cdd1"];

  // 🔥 PERBAIKAN: Tabel departemen mengikuti multi-select
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
      {/* HEADER */}
      <div className="flex items-center gap-2 font-bold text-slate-800 shrink-0 border-b border-slate-100 pb-2">
        <div className="bg-[#2563eb] w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">
          👤
        </div>
        <span className="text-sm tracking-wide">TRAINING MANDAYS</span>
      </div>

      {/* GENDER - SIDE-BY-SIDE */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Gender Distribution
          </span>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="font-semibold bg-slate-100 border border-slate-200 text-slate-600 rounded px-2 py-0.5 outline-none text-[10px] cursor-pointer"
          >
            <option value="All">ALL</option>
            <option value="Male">MALE</option>
            <option value="Female">FEMALE</option>
          </select>
        </div>

        <div className="flex gap-2 w-full">
          {/* Male Card */}
          <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-2 flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-blue-500 w-5 h-5 rounded flex items-center justify-center text-white text-[10px] shadow-sm z-10">
                ♂
              </div>
              <span className="text-[9px] font-bold text-blue-600 z-10">
                MALE
              </span>
            </div>
            <span className="text-xl font-black text-blue-900 z-10">
              {genderCounts.male}
            </span>
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-5">
              ♂
            </div>
          </div>

          {/* Female Card */}
          <div className="flex-1 bg-pink-50 border border-pink-100 rounded-xl p-2 flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-pink-400 w-5 h-5 rounded flex items-center justify-center text-white text-[10px] shadow-sm z-10">
                ♀
              </div>
              <span className="text-[9px] font-bold text-pink-600 z-10">
                FEMALE
              </span>
            </div>
            <span className="text-xl font-black text-pink-900 z-10">
              {genderCounts.female}
            </span>
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-5">
              ♀
            </div>
          </div>
        </div>
      </div>

      {/* KPI + GAUGE */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0 flex items-center gap-3 relative">
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
                  <Cell key={index} fill={COLORS[index]} />
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

        <div className="w-[40%] flex flex-col justify-center gap-3 bg-white border border-slate-100 rounded-lg p-3 shadow-sm h-full min-h-25">
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

      {/* TABLES */}
      <div className="flex-1 min-h-0 grid grid-rows-2 gap-2 mt-1">
        {/* MONTH TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-sm">
          <div className="overflow-y-auto flex-1">
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

        {/* DEPT TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col min-h-0 overflow-hidden shadow-sm">
          <div className="overflow-y-auto flex-1">
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
