"use client";

import React, { useState } from "react";

export default function MatrixCompetency({ userRole }) {
  // Hanya Admin yang bisa mengedit
  const isReadOnly = userRole !== "admin";

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Data Simulasi berdasarkan PPTX
  const [coreCompetencies, setCoreCompetencies] = useState([
    {
      id: 1,
      name: "Team Work & Collaboration",
      target: 4,
      actual: 3,
      type: "",
      details: "",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 2,
      name: "Adaptability and Flexibility",
      target: 3,
      actual: 3,
      type: "",
      details: "",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 3,
      name: "Communication Skill",
      target: 4,
      actual: 4,
      type: "",
      details: "",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 4,
      name: "Continuous Learning & Improvement",
      target: 4,
      actual: 3,
      type: "Coaching",
      details: "",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
  ]);

  const [funcCompetencies, setFuncCompetencies] = useState([
    {
      id: 5,
      name: "Analysis and Reasoning",
      target: 4,
      actual: 3,
      type: "Project Assgn",
      details: "FME Project",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 6,
      name: "Decision Making",
      target: 5,
      actual: 4,
      type: "Project Assgn",
      details: "FME Project",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 7,
      name: "Attention to Detail",
      target: 3,
      actual: 3,
      type: "",
      details: "",
      timeline: "",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 8,
      name: "Leadership",
      target: 5,
      actual: 4,
      type: "Training",
      details: "Leadership Training",
      timeline: "04-Mar-24",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
    {
      id: 9,
      name: "Integrated Management System",
      target: 3,
      actual: 2,
      type: "Training",
      details: "Internal Training with IMS MR",
      timeline: "20-Jun-24",
      curLevel: "",
      evalDate: "",
      remark: "",
    },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  // Fungsi untuk menghitung Gap
  const getGap = (target, actual) => {
    const gap = target - actual;
    return gap > 0 ? gap : 0;
  };

  // Komponen Input Header Dinamis
  const HeaderInput = ({ label, value, type = "text", isSelect = false }) => (
    <div className="flex items-center gap-3 mb-2.5">
      <span className="w-1/3 text-[10px] md:text-[11px] font-bold text-[#5c6bc0]">
        {label}
      </span>
      {isSelect ? (
        <select
          disabled={isReadOnly}
          className="w-2/3 border border-[#cbd5e1] rounded p-1.5 md:p-2 text-[10px] md:text-[11px] text-slate-700 outline-none focus:border-[#5c6bc0] disabled:bg-slate-50 transition-colors"
        >
          <option>{value}</option>
          <option>Johnson Panggabean</option>
          <option>Intan Kurnia Darsono</option>
          <option>Angga Praditya</option>
        </select>
      ) : (
        <input
          type={type}
          defaultValue={value}
          disabled={isReadOnly}
          className="w-2/3 border border-[#cbd5e1] rounded p-1.5 md:p-2 text-[10px] md:text-[11px] text-slate-700 outline-none focus:border-[#5c6bc0] disabled:bg-slate-50 transition-colors"
        />
      )}
    </div>
  );

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full relative">
      {/* NOTIFIKASI SUKSES MENGAMBANG */}
      <div
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#22c55e] text-white px-6 py-2.5 rounded-full shadow-lg font-bold text-xs flex items-center gap-2 transition-all duration-300 ${showSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        Data successfully saved to Database!
      </div>

      {/* HEADER Admin / Viewer Mode */}
      <div className="bg-[#1e3a8a] text-white p-4 flex justify-between items-center shrink-0">
        <h2 className="text-sm md:text-base font-black tracking-widest uppercase">
          Competency Matrix Entry
        </h2>
        {isReadOnly ? (
          <span className="bg-red-500/20 text-red-100 border border-red-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <svg
              className="w-3 h-3"
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
            </svg>{" "}
            Read-Only
          </span>
        ) : (
          <span className="bg-green-500/20 text-green-100 border border-green-500/30 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              ></path>
            </svg>{" "}
            Editing Mode
          </span>
        )}
      </div>

      <div className="p-4 md:p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-50">
        {/* 🔥 HEADER INFO (KEMBALI LENGKAP SEPERTI VIDEO, TAPI GAYA PPTX) */}
        <div className="border border-[#e2e8f0] rounded-xl p-5 bg-white shadow-sm mb-6 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 relative z-10">
            {/* Kolom 1 */}
            <div className="flex flex-col">
              <HeaderInput
                label="Employee Name"
                value="Angga Praditya"
                isSelect={true}
              />
              <HeaderInput label="Job Title" value="Production Manager" />
              <HeaderInput label="Department" value="Production" />
            </div>
            {/* Kolom 2 */}
            <div className="flex flex-col">
              <HeaderInput label="Doc. ID" value="DOC-2024-001" />
              <HeaderInput label="Revision" value="02" />
              <HeaderInput label="Date" value="2024-01-31" type="date" />
            </div>
            {/* Kolom 3 */}
            <div className="flex flex-col">
              <HeaderInput label="Dept. Manager" value="Moehammad Faizal" />
              <HeaderInput label="Reviewed by" value="HR Manager" />
              <HeaderInput label="Approved by" value="Plant Director" />
            </div>
          </div>
        </div>

        {/* UNIFIED MATRIX TABLE SECTION (DARI PPTX) */}
        <div className="bg-white border border-[#cbd5e1] rounded-lg overflow-x-auto shadow-sm mb-6">
          <table className="w-full text-[10px] md:text-[11px] text-center border-collapse">
            <thead className="bg-[#5c6bc0] text-white">
              <tr>
                <th
                  className="p-2 border border-indigo-400 font-bold"
                  rowSpan={2}
                >
                  Competency
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold"
                  colSpan={2}
                >
                  Competency Level
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold"
                  rowSpan={2}
                >
                  Gap Score
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold"
                  colSpan={3}
                >
                  Development Plan
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold"
                  colSpan={3}
                >
                  Development Plan Evaluation
                </th>
              </tr>
              <tr>
                <th className="p-2 border border-indigo-400 font-medium">
                  Target
                </th>
                <th className="p-2 border border-indigo-400 font-medium">
                  Actual
                </th>
                <th className="p-2 border border-indigo-400 font-medium w-24">
                  Type
                </th>
                <th className="p-2 border border-indigo-400 font-medium">
                  Details
                </th>
                <th className="p-2 border border-indigo-400 font-medium w-20">
                  Timeline
                </th>
                <th className="p-2 border border-indigo-400 font-medium w-16">
                  Curent Level
                </th>
                <th className="p-2 border border-indigo-400 font-medium w-20">
                  Eval. Date
                </th>
                <th className="p-2 border border-indigo-400 font-medium">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {/* CORE COMPETENCY */}
              <tr className="bg-slate-100">
                <td
                  colSpan={10}
                  className="p-2 font-bold text-left text-[#5c6bc0] border border-slate-200"
                >
                  Core Competency
                </td>
              </tr>
              {coreCompetencies.map((item) => {
                const gap = getGap(item.target, item.actual);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-2 text-left border border-slate-200 font-medium">
                      {item.name}
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="number"
                        defaultValue={item.target}
                        disabled={isReadOnly}
                        className="w-10 text-center border border-slate-200 rounded bg-white disabled:bg-transparent"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="number"
                        defaultValue={item.actual}
                        disabled={isReadOnly}
                        className="w-10 text-center border border-slate-200 rounded bg-white disabled:bg-transparent"
                      />
                    </td>
                    <td
                      className={`p-2 border border-slate-200 font-bold ${gap > 0 ? "text-red-600" : "text-slate-500"}`}
                    >
                      {gap}
                    </td>
                    <td className="p-1 border border-slate-200">
                      <select
                        defaultValue={item.type}
                        disabled={isReadOnly}
                        className="w-full p-1 text-[10px] border border-slate-200 rounded disabled:bg-transparent outline-none"
                      >
                        <option value=""></option>
                        <option value="Training">Training</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Project Assgn">Project Assgn</option>
                      </select>
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.details}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.timeline}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none text-center"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.curLevel}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none text-center"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="date"
                        defaultValue={item.evalDate}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none text-[9px]"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.remark}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none"
                      />
                    </td>
                  </tr>
                );
              })}

              {/* FUNCTIONAL COMPETENCY */}
              <tr className="bg-slate-100">
                <td
                  colSpan={10}
                  className="p-2 font-bold text-left text-[#5c6bc0] border border-slate-200"
                >
                  Functional Competency
                </td>
              </tr>
              {funcCompetencies.map((item) => {
                const gap = getGap(item.target, item.actual);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-2 text-left border border-slate-200 font-medium">
                      {item.name}
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="number"
                        defaultValue={item.target}
                        disabled={isReadOnly}
                        className="w-10 text-center border border-slate-200 rounded bg-white disabled:bg-transparent"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="number"
                        defaultValue={item.actual}
                        disabled={isReadOnly}
                        className="w-10 text-center border border-slate-200 rounded bg-white disabled:bg-transparent"
                      />
                    </td>
                    <td
                      className={`p-2 border border-slate-200 font-bold ${gap > 0 ? "text-red-600" : "text-slate-500"}`}
                    >
                      {gap}
                    </td>
                    <td className="p-1 border border-slate-200">
                      <select
                        defaultValue={item.type}
                        disabled={isReadOnly}
                        className="w-full p-1 text-[10px] border border-slate-200 rounded disabled:bg-transparent outline-none"
                      >
                        <option value=""></option>
                        <option value="Training">Training</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Project Assgn">Project Assgn</option>
                      </select>
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.details}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.timeline}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none text-center"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.curLevel}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none text-center"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="date"
                        defaultValue={item.evalDate}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none text-[9px]"
                      />
                    </td>
                    <td className="p-1 border border-slate-200">
                      <input
                        type="text"
                        defaultValue={item.remark}
                        disabled={isReadOnly}
                        className="w-full p-1 border border-slate-200 rounded disabled:bg-transparent outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 🔥 BOTTOM SECTION (DIKEMBALIKAN SEPERTI DI VIDEO) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {/* TABEL KPI */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <h3 className="bg-[#1e3a8a] text-white text-[10px] md:text-[11px] font-bold p-2.5 uppercase tracking-widest text-center">
              Key Performance Indicator (KPI)
            </h3>
            <table className="w-full text-[9px] md:text-[10px] text-center">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-2 border-r border-slate-200">KPI Name</th>
                  <th className="p-2 border-r border-slate-200 w-16">Target</th>
                  <th className="p-2 border-r border-slate-200">
                    Pre Dev Plan
                  </th>
                  <th className="p-2 border-r border-slate-200">
                    Post Dev Plan
                  </th>
                  <th className="p-2 w-12">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-b border-slate-100">
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="Productivity %"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="90%"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded text-center disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="Pre"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="Post"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      disabled={isReadOnly}
                      className="w-6 h-6 bg-[#22c55e] hover:bg-green-600 text-white rounded font-bold disabled:opacity-50 transition"
                    >
                      +
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="Defect Rate"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="< 2%"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded text-center disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="Pre"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      placeholder="Post"
                      disabled={isReadOnly}
                      className="w-full p-1.5 border border-slate-200 rounded disabled:bg-transparent"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      disabled={isReadOnly}
                      className="w-6 h-6 bg-[#ef4444] hover:bg-red-600 text-white rounded font-bold disabled:opacity-50 transition"
                    >
                      -
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TABEL REFERENCE DESCRIPTION */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
            <h3 className="bg-[#1e3a8a] text-white text-[10px] md:text-[11px] font-bold p-2.5 uppercase tracking-widest text-center">
              Competency Description & Job Level
            </h3>
            <table className="w-full text-[9px] text-left">
              <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 text-center">
                <tr>
                  <th className="p-2 border-r border-slate-200" colSpan={2}>
                    Core Competency Description
                  </th>
                  <th className="p-2" colSpan={4}>
                    Standard based on Job Level
                  </th>
                </tr>
                <tr className="border-t border-slate-200 text-[8px] bg-slate-50">
                  <th className="p-2 border-r border-slate-200 w-[20%]">
                    Name
                  </th>
                  <th className="p-2 border-r border-slate-200 w-[40%]">
                    Description
                  </th>
                  <th className="p-2 border-r border-slate-200">Manager+</th>
                  <th className="p-2 border-r border-slate-200">Spv</th>
                  <th className="p-2 border-r border-slate-200">Foreman</th>
                  <th className="p-2">Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-center">
                    Integrity
                  </td>
                  <td className="p-2 border-r border-slate-200 text-slate-600 leading-tight">
                    The practice of being honest and showing a consistent and
                    uncompromising adherence to strong moral and ethical
                    principles.
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-center">
                    Result & Focus Initiative
                  </td>
                  <td className="p-2 border-r border-slate-200 text-slate-600 leading-tight">
                    Focuses on results and desired outcomes and how best to
                    achieve them. Gets the job done.
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-center">
                    Problem Solving
                  </td>
                  <td className="p-2 border-r border-slate-200 text-slate-600 leading-tight">
                    Resolves difficult or complicated challenges efficiently.
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    5
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    4
                  </td>
                  <td className="p-2 border-r border-slate-200 text-center font-bold text-[#5c6bc0]">
                    4
                  </td>
                  <td className="p-2 text-center font-bold text-[#5c6bc0]">
                    3
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap gap-3 justify-center md:justify-start shrink-0 relative items-center">
        <button
          onClick={handleSave}
          disabled={isReadOnly || isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-xs font-bold py-2.5 px-6 rounded-lg shadow-md shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving Data...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
              Save Competency Data
            </>
          )}
        </button>
        <button className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[10px] md:text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition active:scale-95">
          Display Calendar
        </button>
        <button className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[10px] md:text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition active:scale-95">
          Competency List
        </button>
      </div>
    </div>
  );
}
