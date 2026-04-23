"use client";

import React, { useState, useEffect } from "react";

export default function MatrixCompetency({ userRole }) {
  // Hanya Admin yang bisa mengedit
  const isReadOnly = userRole !== "admin";

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // STATE UNTUK DATA DYNAMIC DARI GOOGLE SHEET
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Data Simulasi Tabel
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

  // MENGAMBIL DATA KARYAWAN & DEPARTEMEN DARI GOOGLE SHEET
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoadingData(true);
        const response = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Employee%20List",
          { cache: "no-store" },
        );
        const data = await response.json();

        const formattedEmployees = data
          .map((emp) => {
            const getVal = (possibleKeys) => {
              const keys = Object.keys(emp);
              for (let pk of possibleKeys) {
                const match = keys.find(
                  (k) =>
                    k.toLowerCase().replace(/\s+/g, "") ===
                    pk.toLowerCase().replace(/\s+/g, ""),
                );
                if (match) return emp[match];
              }
              return "";
            };
            return {
              name: getVal(["Name", "EmployeeName", "Nama", "Participants"]),
              department: getVal(["Department", "Dept", "Departement"]),
            };
          })
          .filter((emp) => emp.name && emp.department);

        const uniqueNames = [
          ...new Set(formattedEmployees.map((e) => e.name)),
        ].sort();
        const uniqueDepts = [
          ...new Set(formattedEmployees.map((e) => e.department)),
        ].sort();

        setEmployeeOptions(uniqueNames);
        setDepartmentOptions(uniqueDepts);
        setIsLoadingData(false);
      } catch (error) {
        console.error("Gagal menarik data Karyawan dari Google Sheets:", error);
        setIsLoadingData(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const getGap = (target, actual) => {
    const gap = target - actual;
    return gap > 0 ? gap : 0;
  };

  const addFuncCompetency = () => {
    setFuncCompetencies([
      ...funcCompetencies,
      {
        id: Date.now(),
        name: "",
        target: 0,
        actual: 0,
        type: "",
        details: "",
        timeline: "",
        curLevel: "",
        evalDate: "",
        remark: "",
      },
    ]);
  };

  const removeFuncCompetency = (id) => {
    setFuncCompetencies(funcCompetencies.filter((item) => item.id !== id));
  };

  // Gaya Input Tabel Dinamis
  const tableInputClass = `w-full text-[10px] md:text-[11px] p-1.5 outline-none transition-all disabled:bg-transparent disabled:border-transparent disabled:text-slate-800 disabled:font-medium ${isReadOnly ? "text-center" : "border border-slate-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"}`;

  // Komponen Input Header
  const HeaderInput = ({
    label,
    value,
    type = "text",
    isSelect = false,
    options = [],
    isLoading = false,
  }) => (
    <div className="flex items-center gap-3 mb-3">
      <span className="w-1/3 text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">
        {label}
      </span>
      {isSelect ? (
        <select
          disabled={isReadOnly || isLoading}
          defaultValue={value}
          className="w-2/3 border border-slate-200 rounded-lg p-2 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 shadow-sm transition-all"
        >
          {isLoading ? (
            <option>Loading data...</option>
          ) : (
            <>
              <option value={value}>{value}</option>
              {options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt}
                </option>
              ))}
            </>
          )}
        </select>
      ) : (
        <input
          type={type}
          defaultValue={value}
          disabled={isReadOnly}
          className="w-2/3 border border-slate-200 rounded-lg p-2 text-[11px] font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 shadow-sm transition-all"
        />
      )}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col relative z-20">
      {/* NOTIFIKASI SUKSES */}
      <div
        className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100000] bg-[#22c55e] text-white px-6 py-3 rounded-full shadow-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-500 ${showSuccess ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-10 scale-95 pointer-events-none"}`}
      >
        <svg
          className="w-5 h-5"
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
        Data Successfully Saved!
      </div>

      {/* HEADER INFORMATION SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 md:p-6 mb-6 shrink-0 flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-widest">
              Employee Profile
            </h2>
            <div className="flex gap-1.5 hidden sm:flex">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>
          {isReadOnly ? (
            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
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
              Read-Only Mode
            </span>
          ) : (
            <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 relative z-10">
          <div>
            <HeaderInput
              label="Employee Name"
              value="-- Select Employee --"
              isSelect={true}
              options={employeeOptions}
              isLoading={isLoadingData}
            />
            <HeaderInput label="Job Title" value="Production Manager" />
            <HeaderInput
              label="Department"
              value="-- Select Dept --"
              isSelect={true}
              options={departmentOptions}
              isLoading={isLoadingData}
            />
          </div>
          <div>
            <HeaderInput label="Last Update" value="2024-01-31" type="date" />
          </div>
          <div>
            <HeaderInput label="Dept. Manager" value="Moehammad Faizal" />
            <HeaderInput label="Reviewed by" value="HR Manager" />
            <HeaderInput label="Approved by" value="Plant Director" />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* UNIFIED MATRIX TABLE SECTION (MODERN WRAPPER + GRID TABLE) */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 md:p-5 flex flex-col mb-6 shrink-0">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 shrink-0">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Competency Development Plan
          </h2>
          <div className="flex gap-1.5 ml-2 hidden sm:flex">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto rounded-xl border border-slate-300 custom-scrollbar">
          {/* 🔥 BORDER-COLLAPSE DIPERTAHANKAN AGAR GRID MATRIX TIDAK RUSAK */}
          <table className="w-full min-w-[1000px] text-[10px] md:text-[11px] text-center border-collapse">
            <thead className="bg-[#5c6bc0] text-white sticky top-0 z-10">
              <tr>
                <th
                  className="p-2 border border-indigo-400 font-bold uppercase tracking-wider align-middle"
                  rowSpan={2}
                >
                  Competency
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold uppercase tracking-wider"
                  colSpan={2}
                >
                  Competency Level
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold uppercase tracking-wider align-middle"
                  rowSpan={2}
                >
                  Gap Score
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold uppercase tracking-wider"
                  colSpan={3}
                >
                  Development Plan
                </th>
                <th
                  className="p-2 border border-indigo-400 font-bold uppercase tracking-wider"
                  colSpan={3}
                >
                  Development Plan Evaluation
                </th>
              </tr>
              <tr>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider">
                  Target
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider">
                  Actual
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider w-24">
                  Type
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider">
                  Details
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider w-20">
                  Timeline
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider w-16">
                  Current Level
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider w-20">
                  Evaluation Date
                </th>
                <th className="p-2 border border-indigo-400 font-medium uppercase tracking-wider">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              {/* CORE COMPETENCY */}
              <tr className="bg-slate-100">
                <td
                  colSpan={10}
                  className="p-2.5 font-black text-slate-800 uppercase tracking-widest text-left border border-slate-300"
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
                    <td className="p-2 text-left font-bold text-slate-700 border border-slate-300">
                      {item.name}
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="number"
                        defaultValue={item.target}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center font-bold text-slate-900 mx-auto max-w-[50px]`}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="number"
                        defaultValue={item.actual}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center font-bold text-blue-700 mx-auto max-w-[50px]`}
                      />
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      {gap > 0 ? (
                        <span className="inline-block bg-red-100 text-red-600 font-black px-2 py-0.5 rounded">
                          {gap}
                        </span>
                      ) : (
                        <span className="inline-block text-slate-400 font-bold px-2 py-0.5">
                          -
                        </span>
                      )}
                    </td>
                    <td className="p-1 border border-slate-300">
                      <select
                        defaultValue={item.type}
                        disabled={isReadOnly}
                        className={`${tableInputClass} font-medium`}
                      >
                        <option value=""></option>
                        <option value="Training">Training</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Project Assgn">Project Assgn</option>
                      </select>
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.details}
                        disabled={isReadOnly}
                        className={tableInputClass}
                        placeholder={!isReadOnly ? "Enter details..." : ""}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.timeline}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center`}
                        placeholder={!isReadOnly ? "Timeline" : ""}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.curLevel}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center font-bold text-slate-700`}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="date"
                        defaultValue={item.evalDate}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-[9px]`}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.remark}
                        disabled={isReadOnly}
                        className={tableInputClass}
                        placeholder={!isReadOnly ? "Remarks..." : ""}
                      />
                    </td>
                  </tr>
                );
              })}

              {/* FUNCTIONAL COMPETENCY */}
              <tr className="bg-slate-100">
                <td
                  colSpan={10}
                  className="p-2.5 font-black text-slate-800 uppercase tracking-widest text-left border border-slate-300"
                >
                  Functional Competency
                </td>
              </tr>
              {funcCompetencies.map((item) => {
                const gap = getGap(item.target, item.actual);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/50 transition-colors group relative"
                  >
                    <td className="p-1 border border-slate-300 text-left">
                      <div className="flex items-center gap-1">
                        <select
                          defaultValue={item.name}
                          disabled={isReadOnly}
                          className={`${tableInputClass} font-bold text-slate-700 text-left`}
                        >
                          <option value={item.name}>
                            {item.name || "-- Select Competency --"}
                          </option>
                          <option value="Analysis and Reasoning">
                            Analysis and Reasoning
                          </option>
                          <option value="Decision Making">
                            Decision Making
                          </option>
                          <option value="Attention to Detail">
                            Attention to Detail
                          </option>
                          <option value="Managing Projects">
                            Managing Projects
                          </option>
                          <option value="Technical Knowledge">
                            Technical Knowledge
                          </option>
                        </select>
                        {!isReadOnly && (
                          <button
                            onClick={() => removeFuncCompetency(item.id)}
                            className="w-5 h-5 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center font-bold transition-all shrink-0 opacity-0 group-hover:opacity-100"
                            title="Remove row"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="number"
                        defaultValue={item.target}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center font-bold text-slate-900 mx-auto max-w-[50px]`}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="number"
                        defaultValue={item.actual}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center font-bold text-blue-700 mx-auto max-w-[50px]`}
                      />
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      {gap > 0 ? (
                        <span className="inline-block bg-red-100 text-red-600 font-black px-2 py-0.5 rounded">
                          {gap}
                        </span>
                      ) : (
                        <span className="inline-block text-slate-400 font-bold px-2 py-0.5">
                          -
                        </span>
                      )}
                    </td>
                    <td className="p-1 border border-slate-300">
                      <select
                        defaultValue={item.type}
                        disabled={isReadOnly}
                        className={`${tableInputClass} font-medium`}
                      >
                        <option value=""></option>
                        <option value="Training">Training</option>
                        <option value="Coaching">Coaching</option>
                        <option value="Project Assgn">Project Assgn</option>
                      </select>
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.details}
                        disabled={isReadOnly}
                        className={tableInputClass}
                        placeholder={!isReadOnly ? "Enter details..." : ""}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.timeline}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center`}
                        placeholder={!isReadOnly ? "Timeline" : ""}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.curLevel}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-center font-bold text-slate-700`}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="date"
                        defaultValue={item.evalDate}
                        disabled={isReadOnly}
                        className={`${tableInputClass} text-[9px]`}
                      />
                    </td>
                    <td className="p-1 border border-slate-300">
                      <input
                        type="text"
                        defaultValue={item.remark}
                        disabled={isReadOnly}
                        className={tableInputClass}
                        placeholder={!isReadOnly ? "Remarks..." : ""}
                      />
                    </td>
                  </tr>
                );
              })}

              {/* TOMBOL ADD NEW FUNCTIONAL COMPETENCY */}
              {!isReadOnly && (
                <tr className="bg-slate-50">
                  <td
                    colSpan={10}
                    className="p-2 border border-slate-300 text-left"
                  >
                    <button
                      onClick={addFuncCompetency}
                      className="bg-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white text-[10px] font-bold py-1.5 px-3 rounded transition flex items-center gap-1.5 uppercase tracking-wider shadow-sm"
                    >
                      <span className="text-sm leading-none mt-[-1px]">+</span>{" "}
                      Add Competency Row
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* SCORING SYSTEM TABLE (MODERN WRAPPER + GRID TABLE) */}
      {/* ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 md:p-5 flex flex-col mb-6 shrink-0 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 shrink-0">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Scoring System Reference
          </h2>
          <div className="flex gap-1.5 ml-2 hidden sm:flex">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f766e]"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]"></div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto rounded-xl border border-[#0d9488] custom-scrollbar">
          {/* 🔥 BORDER-COLLAPSE DIPERTAHANKAN */}
          <table className="w-full text-[10px] md:text-[11px] text-left border-collapse">
            <thead className="bg-[#0f766e] text-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-3 text-center font-bold uppercase tracking-wider border border-[#0d9488] w-16">
                  Score
                </th>
                <th className="p-3 text-left font-bold uppercase tracking-wider border border-[#0d9488] w-48">
                  Level
                </th>
                <th className="p-3 text-left font-bold uppercase tracking-wider border border-[#0d9488]">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-slate-700">
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 text-center font-black text-slate-800 text-lg border border-slate-300">
                  1
                </td>
                <td className="p-3 font-bold border border-slate-300">
                  Basic Knowledge
                </td>
                <td className="p-3 font-medium border border-slate-300">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Have common knowledge or understanding of basic techniques
                      and concepts.
                    </li>
                    <li>Focus on Learning.</li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 text-center font-black text-slate-800 text-lg border border-slate-300">
                  2
                </td>
                <td className="p-3 font-bold border border-slate-300">
                  Novice (limited experience)
                </td>
                <td className="p-3 font-medium border border-slate-300">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Have the level of experience gained in a classroom
                      (theoretical experience).
                    </li>
                    <li>Needs help when performing the skill/competency.</li>
                    <li>Focus on developing through on the job experience.</li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 text-center font-black text-slate-800 text-lg border border-slate-300">
                  3
                </td>
                <td className="p-3 font-bold border border-slate-300">
                  Intermediate (practical application)
                </td>
                <td className="p-3 font-medium border border-slate-300">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Able to complete tasks as requested.</li>
                    <li>Less Supervisions/guidance to perform successfully.</li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="p-3 text-center font-black text-slate-800 text-lg border border-slate-300">
                  4
                </td>
                <td className="p-3 font-bold border border-slate-300">
                  Advanced (applied theory)
                </td>
                <td className="p-3 font-medium border border-slate-300">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Capable and experienced.</li>
                    <li>Able to perform without assistance (independently).</li>
                    <li>
                      Can provide practical/relevant ideas which easily be
                      implemented.
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className="hover:bg-emerald-50/50 bg-emerald-50/20 transition">
                <td className="p-3 text-center font-black text-emerald-600 text-lg border border-slate-300">
                  5
                </td>
                <td className="p-3 font-bold text-emerald-700 border border-slate-300">
                  Expert (recognized authority)
                </td>
                <td className="p-3 font-medium text-emerald-800 border border-slate-300">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Fully capable and experienced.</li>
                    <li>
                      Known as an expert; Sought for help by other in this area
                      competency.
                    </li>
                    <li>Demonstrated ability to lead and train others.</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="mt-2 mb-8 flex flex-wrap gap-3 justify-center md:justify-start shrink-0 relative z-10 w-full px-1">
        <button
          onClick={handleSave}
          disabled={isReadOnly || isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] md:text-xs font-black uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center gap-2 border border-blue-500"
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
              Saving...
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
        <button className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] md:text-xs font-bold uppercase tracking-wider py-3.5 px-6 rounded-xl shadow-sm transition active:scale-95">
          Print Document
        </button>
      </div>
    </div>
  );
}
