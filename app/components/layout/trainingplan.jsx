"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function TrainingPlan() {
  // Data tetap sama sesuai permintaan
  const plannedData = [
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
      dept: "Operation",
      title: "Camera Detection Capsule",
      type: "Internal",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Solidwork Training with CMM",
      type: "External",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Energy Audit",
      type: "External",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Manager Energy - BNSP",
      type: "External",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Refresh training for Basic QA & Visual defect",
      type: "Internal",
      status: "TBC",
    },
    {
      dept: "Operation",
      title: "Refresh Basic Knowledge of Prod. Machine ...",
      type: "Internal",
      status: "TBC",
    },
  ];

  const adHocData = [
    {
      dept: "QA",
      title: "How to Network When You Don't Like Networking",
      status: "Complete - Ad Hoc",
    },
    {
      dept: "QA",
      title: "Characteristics of a Great Scrum Master",
      status: "Complete - Ad Hoc",
    },
    {
      dept: "HR",
      title: "Transform Your Days with Strategic Time Blocking",
      status: "Complete - Ad Hoc",
    },
    {
      dept: "HR",
      title:
        "Hire Better. Hire Faster with Social Media and Digital Platfor...",
      status: "Complete - Ad Hoc",
    },
    {
      dept: "FIC",
      title: "The Four Tendencies: How to Build Better Habits and Relati...",
      status: "Complete - Ad Hoc",
    },
    {
      dept: "FIC",
      title: "AI Prompts for Deep Research: Real-World Use Cases",
      status: "Complete - Ad Hoc",
    },
    {
      dept: "FIC",
      title: "Uncertainty to Action: Starting Your AI Learning Journey",
      status: "Complete - Ad Hoc",
    },
  ];

  const chartData = [
    { name: "Planned", value: 90.6 },
    { name: "Ad Hoc", value: 9.4 },
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
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    // overflow-y-auto di mobile agar bisa discroll, lg:overflow-hidden di desktop biar tetap fit ke layar
    <div className="h-full w-full flex flex-col lg:flex-row gap-4 p-3 md:p-4 overflow-y-auto lg:overflow-hidden font-sans custom-scrollbar bg-[#f8fafc]">
      {/* ================= KIRI: TABEL ================= */}
      <div className="flex-[1.5] flex flex-col gap-4 min-w-0">
        {/* TABEL PLANNED TRAINING */}
        <div className="h-[350px] lg:flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase italic">
              PLANNED TRAINING
            </h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="flex-1 overflow-auto border border-slate-100 rounded-lg">
            <table className="w-full min-w-[450px] text-[10px] md:text-xs text-left">
              <thead className="bg-[#2563eb] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-semibold">Dept</th>
                  <th className="p-2 font-semibold">Training Title</th>
                  <th className="p-2 font-semibold">Type</th>
                  <th className="p-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 divide-y divide-slate-50">
                {plannedData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="p-2 font-medium">{row.dept}</td>
                    <td className="p-2 truncate max-w-[150px] md:max-w-[250px]">
                      {row.title}
                    </td>
                    <td className="p-2">{row.type}</td>
                    <td className="p-2 text-slate-400 font-bold">
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL AD HOC TRAINING */}
        <div className="h-[350px] lg:flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase italic">
              AD HOC TRAINING
            </h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="flex-1 overflow-auto border border-slate-100 rounded-lg">
            <table className="w-full min-w-[450px] text-[10px] md:text-xs text-left">
              <thead className="bg-[#8b5cf6] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-semibold">Dept</th>
                  <th className="p-2 font-semibold">Training Title</th>
                  <th className="p-2 font-semibold">Status Label</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 divide-y divide-slate-50">
                {adHocData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="p-2 font-medium">{row.dept}</td>
                    <td className="p-2 truncate max-w-[200px] md:max-w-[300px]">
                      {row.title}
                    </td>
                    <td className="p-2 text-purple-600 font-bold uppercase text-[9px]">
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= KANAN: FILTERS & CHART ================= */}
      <div className="w-full lg:w-[35%] flex flex-col gap-4 shrink-0 lg:min-h-0">
        {/* FILTERS - Tetap sebaris tapi text menyesuaikan */}
        <div className="flex gap-2 shrink-0">
          <div className="bg-[#0ea5e9] text-white flex-1 rounded-xl flex items-center justify-between p-2.5 md:p-3 font-bold text-[10px] md:text-xs cursor-pointer shadow-md active:scale-95 transition">
            <span>DEPARTEMENT</span> <span>▼</span>
          </div>
          <div className="bg-[#84cc16] text-white flex-1 rounded-xl flex items-center justify-between p-2.5 md:p-3 font-bold text-[10px] md:text-xs cursor-pointer shadow-md active:scale-95 transition">
            <span>TRAINING TYPE</span> <span>▼</span>
          </div>
        </div>

        {/* DONUT CHART - Pakai min-height agar tidak hilang di mobile */}
        <div className="min-h-[400px] lg:flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-4 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <h2 className="font-black text-slate-800 text-xs md:text-sm tracking-wide uppercase italic">
              PLANNED VS AD HOC
            </h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
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
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text Persentase (Planned) */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="block text-3xl font-black text-slate-800">
                90.6%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Planned
              </span>
            </div>
          </div>
        </div>

        {/* Spacer bawah untuk mobile agar tidak mepet snap-y */}
        <div className="h-10 lg:hidden shrink-0"></div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
