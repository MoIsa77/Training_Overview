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
  // Data dummy sesuai screenshot (Nanti bisa diganti dengan fetch dari Google Sheet)
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
  const COLORS = ["#3b82f6", "#8b5cf6"]; // Biru untuk Planned, Ungu untuk Ad Hoc

  // Custom label untuk menampilkan persentase di dalam Donut Chart
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
        fontSize="14"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row gap-4 p-4 overflow-hidden font-sans">
      {/* ================= KIRI: TABEL ================= */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* TABEL PLANNED TRAINING */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <h2 className="font-bold text-slate-800 tracking-wide">
              PLANNED TRAINING
            </h2>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full min-w-[520px] text-sm text-left">
              <thead className="bg-[#2563eb] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-semibold">Dept</th>
                  <th className="p-2 font-semibold">Training Title</th>
                  <th className="p-2 font-semibold">Type of Training</th>
                  <th className="p-2 font-semibold">Status Label</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {plannedData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-2 whitespace-nowrap">{row.dept}</td>
                    <td className="p-2 truncate max-w-[200px]">{row.title}</td>
                    <td className="p-2">{row.type}</td>
                    <td className="p-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL AD HOC TRAINING */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <h2 className="font-bold text-slate-800 tracking-wide">
              AD HOC TRAINING
            </h2>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full min-w-[520px] text-sm text-left">
              <thead className="bg-[#8b5cf6] text-white sticky top-0 z-10">
                <tr>
                  <th className="p-2 font-semibold">Dept</th>
                  <th className="p-2 font-semibold">Training Title</th>
                  <th className="p-2 font-semibold">Status Label</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {adHocData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-2 whitespace-nowrap">{row.dept}</td>
                    <td className="p-2 truncate max-w-[300px]">{row.title}</td>
                    <td className="p-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= KANAN: FILTERS & CHART ================= */}
      <div className="w-full lg:w-[35%] flex flex-col gap-4 min-w-0 shrink-0">
        {/* FILTERS */}
        <div className="flex gap-2 shrink-0">
          <div className="bg-[#0ea5e9] hover:bg-[#0284c7] transition text-white flex-1 rounded-xl flex items-center justify-between p-3 font-bold text-sm cursor-pointer shadow-md">
            <span>DEPARTEMENT</span> <span>▼</span>
          </div>
          <div className="bg-[#84cc16] hover:bg-[#65a30d] transition text-white flex-1 rounded-xl flex items-center justify-between p-3 font-bold text-sm cursor-pointer shadow-md">
            <span>TRAINING TYPE</span> <span>▼</span>
          </div>
        </div>

        {/* DONUT CHART */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-300 shadow-md p-4 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <h2 className="font-bold text-slate-800 tracking-wide">
              PLANNED VS AD HOC TRAINING
            </h2>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="80%"
                  dataKey="value"
                  stroke="white"
                  strokeWidth={3}
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
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
