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
  // Data dummy dipertahankan sesuai permintaan
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
  const COLORS = ["#3b82f6", "#8b5cf6"]; // Biru, Ungu

  // Label persentase diletakkan di atas irisan (slice)
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    // Mengatur radius agar teks pas berada di tengah irisan
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
    <div className="h-full w-full flex flex-col lg:flex-row gap-3 md:gap-4 p-3 md:p-4 overflow-y-auto lg:overflow-hidden font-sans custom-scrollbar">
      {/* ================= KIRI: TABEL ================= */}
      <div className="flex-[1.5] flex flex-col gap-3 md:gap-4 min-w-0">
        {/* TABEL PLANNED TRAINING */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col min-h-[350px] lg:min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
              PLANNED TRAINING
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
                {plannedData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="p-2 font-medium">{row.dept}</td>
                    <td className="p-2 truncate max-w-[200px]">{row.title}</td>
                    <td className="p-2">{row.type}</td>
                    <td className="p-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="text-right text-[10px] md:text-[11px] font-medium text-slate-600 mt-2 shrink-0 flex justify-end items-center gap-2 pr-2">
            1 - 100 / 256
            <span className="cursor-pointer text-slate-400 hover:text-slate-800 text-lg leading-none font-bold">
              &lt;
            </span>
            <span className="cursor-pointer text-slate-400 hover:text-slate-800 text-lg leading-none font-bold">
              &gt;
            </span>
          </div>
        </div>

        {/* TABEL AD HOC TRAINING */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col min-h-[350px] lg:min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
              AD HOC TRAINING
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
                {adHocData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="p-2 font-medium">{row.dept}</td>
                    <td className="p-2 truncate max-w-[250px]">{row.title}</td>
                    <td className="p-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Spacer statis agar padding sama dengan tabel di atas */}
          <div className="h-6 shrink-0"></div>
        </div>
      </div>

      {/* ================= KANAN: FILTERS & CHART ================= */}
      <div className="w-full lg:w-[35%] flex flex-col gap-3 md:gap-4 shrink-0 min-h-0">
        {/* TOMBOL FILTERS KHUSUS TRAINING PLAN */}
        <div className="flex gap-2 md:gap-3 shrink-0">
          <div className="bg-[#0284c7] hover:bg-[#0369a1] text-white flex-1 rounded-xl flex items-center justify-between p-3 md:p-4 font-bold text-[10px] md:text-xs cursor-pointer shadow-md transition active:scale-95">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider">DEPARTEMENT</span>
              {/* Ikon Gedung (Building) */}
              <svg
                className="w-5 h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 2H9c-1.103 0-2 .897-2 2v5.586l-4.707 4.707A1 1 0 0 0 2 15v6h6v-6h4v6h10V4c0-1.103-.897-2-2-2zm-8 18H4v-4.586l3-3L11 16.414V20zm8 0h-6v-6H7v-3.586l2-2V4h10v16z" />
                <path d="M11 6h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z" />
              </svg>
            </div>
            <span className="text-[10px]">▼</span>
          </div>

          <div className="bg-[#84cc16] hover:bg-[#65a30d] text-white flex-1 rounded-xl flex items-center justify-between p-3 md:p-4 font-bold text-[10px] md:text-xs cursor-pointer shadow-md transition active:scale-95">
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider">TRAINING TYPE</span>
              {/* Ikon Bar Chart ABC */}
              <svg
                className="w-5 h-5 opacity-90"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 21H3V3h2v16h16v2zM7 10h4v8H7v-8zm6-4h4v12h-4V6z" />
              </svg>
            </div>
            <span className="text-[10px]">▼</span>
          </div>
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
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Spacer mobile */}
      <div className="h-10 lg:hidden shrink-0"></div>

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
