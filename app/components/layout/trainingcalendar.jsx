"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateRangeFromWeek(week, year = 2026) {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset =
    firstDayOfYear.getDay() === 0 ? 1 : 8 - firstDayOfYear.getDay();
  const firstMonday = new Date(year, 0, daysOffset - 6);
  const start = new Date(
    firstMonday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000,
  );
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const format = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return {
    start: format(start),
    end: format(end),
    label: `Week ${String(week).padStart(2, "0")} (${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]})`,
  };
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function getStatusColor(status) {
  switch (status) {
    case "plan":
      return "bg-[#00c2ff] text-white";
    case "actual":
      return "bg-[#00e676] text-white";
    case "cancelled":
      return "bg-[#ff1744] text-white";
    case "hold":
      return "bg-[#bdbdbd] text-white";
    default:
      return "";
  }
}

function getStatusBgColor(status) {
  switch (status) {
    case "plan":
      return "bg-[#00c2ff]";
    case "actual":
      return "bg-[#00e676]";
    case "cancelled":
      return "bg-[#ff1744]";
    case "hold":
      return "bg-[#bdbdbd]";
    default:
      return "bg-transparent";
  }
}

function isDateInRange(date, start, end) {
  if (!start || !end) return false;
  const d = new Date(date);
  const s = new Date(start);
  const e = new Date(end);
  d.setHours(0, 0, 0, 0);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  return d >= s && d <= e;
}

function isSameDate(d1, d2) {
  if (!d1 || !d2) return false;
  return new Date(d1).toDateString() === new Date(d2).toDateString();
}

function parseDateRange(dateStr, year = 2026) {
  if (!dateStr) return { startDate: "", endDate: "" };
  const str = dateStr.toString().trim();
  const weekMatch = str.match(/Week\s+(\d+)/i);
  if (weekMatch) {
    const range = getDateRangeFromWeek(parseInt(weekMatch[1]), year);
    return { startDate: range.start, endDate: range.end };
  }
  const dateMatch = str.match(/(\d+)\s*-\s*(\d+)\s+([a-zA-Z]+)/);
  if (dateMatch) {
    const startDay = parseInt(dateMatch[1]);
    const endDay = parseInt(dateMatch[2]);
    const monthStr = dateMatch[3].substring(0, 3);
    const monthIndex = months.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase(),
    );
    if (monthIndex !== -1) {
      const sDate = new Date(year, monthIndex, startDay);
      const eDate = new Date(year, monthIndex, endDay);
      const format = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return { startDate: format(sDate), endDate: format(eDate) };
    }
  }
  return { startDate: "", endDate: "" };
}

const CustomSelect = ({ name, value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-lg p-2 md:p-2.5 h-[36px] md:h-[38px] bg-white flex items-center justify-between cursor-pointer transition shadow-sm ${isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-blue-400"}`}
      >
        <span
          className={`truncate font-bold text-[10px] md:text-[11px] ${selectedOption ? "text-slate-700" : "text-slate-400"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={`text-[9px] text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-48 overflow-y-auto py-1 custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange({ target: { name, value: opt.value } });
                  setIsOpen(false);
                }}
                className={`px-3 py-2.5 text-[11px] font-bold cursor-pointer transition flex items-center gap-2 ${value === opt.value ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${value === opt.value ? "border-blue-600 bg-white" : "border-slate-300"}`}
                >
                  {value === opt.value && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CascadingEmployeeSelect = ({
  employeesData,
  selectedParticipants,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const departments = useMemo(() => {
    const depts = [
      ...new Set(employeesData.map((emp) => emp.department).filter(Boolean)),
    ];
    return depts.sort();
  }, [employeesData]);

  const filteredEmployees = useMemo(() => {
    if (!selectedDept) return [];
    return employeesData
      .filter((emp) => emp.department === selectedDept)
      .filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }, [employeesData, selectedDept, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleEmployee = (empName) => {
    const currentArray = selectedParticipants
      ? selectedParticipants.split(", ").filter(Boolean)
      : [];
    let newArray;
    if (currentArray.includes(empName)) {
      newArray = currentArray.filter((name) => name !== empName);
    } else {
      newArray = [...currentArray, empName];
    }
    onChange({ target: { name: "participants", value: newArray.join(", ") } });
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({ target: { name: "participants", value: "" } });
    setSelectedDept("");
  };

  const displayText = selectedParticipants
    ? selectedParticipants.split(",").length > 1
      ? `${selectedParticipants.split(",")[0]} +${selectedParticipants.split(",").length - 1} more`
      : selectedParticipants
    : "Select Dept & Participants...";

  return (
    <div ref={dropdownRef} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-lg p-2 md:p-2.5 h-[36px] md:h-[38px] bg-white flex items-center justify-between cursor-pointer transition shadow-sm ${isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-blue-400"}`}
      >
        <span
          className={`truncate font-bold text-[10px] md:text-[11px] ${selectedParticipants ? "text-blue-700" : "text-slate-400"}`}
        >
          {displayText}
        </span>

        <div className="flex items-center gap-2">
          {selectedParticipants && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center text-[10px] transition-colors"
            >
              ✕
            </button>
          )}
          <span
            className={`text-[9px] text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          >
            ▼
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full md:w-[250%] lg:w-[200%] mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col md:flex-row h-[300px]">
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50 overflow-y-auto custom-scrollbar flex flex-col h-[100px] md:h-full shrink-0">
            <div className="p-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 sticky top-0 z-10 shadow-sm">
              1. Department
            </div>
            {departments.map((dept) => (
              <div
                key={dept}
                onClick={() => {
                  setSelectedDept(dept);
                  setSearchTerm("");
                }}
                className={`px-3 py-2 text-[10px] md:text-[11px] font-bold cursor-pointer transition border-l-2 ${selectedDept === dept ? "border-blue-600 bg-white text-blue-700 shadow-sm z-0 relative" : "border-transparent hover:bg-slate-100 text-slate-600"}`}
              >
                {dept}
              </div>
            ))}
          </div>

          <div className="w-full md:w-2/3 flex flex-col h-full bg-white">
            <div className="p-2 bg-white sticky top-0 z-10 border-b border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  2. Participants {selectedDept ? `(${selectedDept})` : ""}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    selectedDept
                      ? "Search name or ID..."
                      : "Select department first"
                  }
                  disabled={!selectedDept}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 rounded-md py-1.5 pl-7 pr-2 text-[10px] md:text-[11px] font-medium outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors"
                />
                <svg
                  className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
              {!selectedDept ? (
                <div className="h-full flex items-center justify-center text-[10px] md:text-[11px] text-slate-400 font-medium p-4 text-center">
                  👈 Please select a department from the list on the left
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[10px] md:text-[11px] text-slate-400 font-medium p-4 text-center">
                  No employees found matching "{searchTerm}"
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const currentArray = selectedParticipants
                    ? selectedParticipants.split(", ").filter(Boolean)
                    : [];
                  const isChecked = currentArray.includes(emp.name);

                  return (
                    <div
                      key={emp.id || emp.name}
                      onClick={() => toggleEmployee(emp.name)}
                      className="px-3 py-2 cursor-pointer transition hover:bg-slate-50 flex items-center gap-3"
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors shrink-0 ${isChecked ? "bg-blue-500 border-blue-500" : "bg-white border-slate-300"}`}
                      >
                        {isChecked && (
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
                      <div className="flex flex-col min-w-0">
                        <span
                          className={`text-[10px] md:text-[11px] font-bold truncate ${isChecked ? "text-blue-700" : "text-slate-700"}`}
                        >
                          {emp.name}
                        </span>
                        {emp.id && (
                          <span className="text-[8px] md:text-[9px] text-slate-400 font-medium tracking-wider">
                            {emp.id}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-2 border-t border-slate-100 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-md text-[10px] transition-colors shadow-sm"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
// 🔥 PENAMBAHAN PROP userRole
export default function TrainingCalendar({ userRole = "viewer" }) {
  const [trainings, setTrainings] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [inputMode, setInputMode] = useState("date");

  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    dateRange: "",
    startDate: "",
    endDate: "",
    type: "Internal",
    participants: "",
    status: "plan",
    weekNumber: "",
  });

  useEffect(() => {
    setIsMounted(true);
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const responseCalendar = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Training%20Calendar",
          { cache: "no-store" },
        );
        const dataCalendar = await responseCalendar.json();

        const formattedData = dataCalendar.map((item) => {
          const dateStr = item["Date"] || "";
          const parsedDates = parseDateRange(dateStr, 2026);

          return {
            title: item["Training Title"] || "Untitled",
            dateRange: dateStr,
            startDate: parsedDates.startDate,
            endDate: parsedDates.endDate,
            type: item["Training Type"] || "Internal",
            dept: item["Dept"] || "",
            participants: item["Participants"] || "TBC",
            status: item["status"]
              ? item["status"].toLowerCase().trim()
              : "plan",
          };
        });

        setTrainings(formattedData);

        const responseEmployees = await fetch(
          "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Employee%20List",
          { cache: "no-store" },
        );
        const dataEmployees = await responseEmployees.json();

        const formattedEmployees = dataEmployees
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
              id: getVal(["ID", "NIK", "EmployeeID", "No"]) || "",
            };
          })
          .filter((emp) => emp.name && emp.department);

        setEmployeesList(formattedEmployees);
        setIsLoading(false);
      } catch (error) {
        console.error("Gagal menarik data dari Google Sheets:", error);
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "weekNumber") {
      const range = getDateRangeFromWeek(parseInt(value));
      setForm({
        ...form,
        weekNumber: value,
        startDate: range.start,
        endDate: range.end,
        dateRange: range.label,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  function handleDateClick(date) {
    // 🔥 CEGAH KLIK JIKA VIEWER
    if (userRole !== "admin") return;

    if (inputMode === "week") setInputMode("date");

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      setForm({
        ...form,
        startDate: date,
        endDate: date,
        dateRange: date,
        weekNumber: "",
      });
    } else {
      const d1 = new Date(rangeStart);
      const d2 = new Date(date);
      if (d2 < d1) {
        setRangeStart(date);
        setRangeEnd(rangeStart);
        setForm({
          ...form,
          startDate: date,
          endDate: rangeStart,
          dateRange: `${date} - ${rangeStart}`,
          weekNumber: "",
        });
      } else {
        setRangeEnd(date);
        setForm({
          ...form,
          startDate: rangeStart,
          endDate: date,
          dateRange: `${rangeStart} - ${date}`,
          weekNumber: "",
        });
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userRole !== "admin") return;

    setTrainings([...trainings, form]);
    setForm({
      title: "",
      dateRange: "",
      startDate: "",
      endDate: "",
      type: "Internal",
      participants: "",
      status: "plan",
      weekNumber: "",
    });
    setRangeStart(null);
    setRangeEnd(null);
  };

  const renderDays = (year, monthIndex) => {
    const firstDayDate = new Date(year, monthIndex, 1);
    const firstDayCol = firstDayDate.getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    const rows = [];
    let dayCounter = 1;
    let currentWeekNum = getWeekNumber(firstDayDate);

    for (let i = 0; i < 6; i++) {
      const weekCells = [];
      weekCells.push(
        <div
          key={`week-${i}`}
          className="text-[6px] md:text-[7px] text-slate-400 font-bold flex items-center justify-center border-r border-slate-50 h-full"
        >
          W{String(currentWeekNum).padStart(2, "0")}
        </div>,
      );

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayCol) || dayCounter > totalDays) {
          weekCells.push(
            <div key={`empty-${i}-${j}`} className="h-full w-full"></div>,
          );
        } else {
          const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(dayCounter).padStart(2, "0")}`;
          const isSunday = j === 0;

          const dayTrainings = trainings.filter((t) =>
            isDateInRange(dateKey, t.startDate, t.endDate),
          );

          let cellStyle = `text-[8px] md:text-[9px] text-center h-full w-full flex items-center justify-center transition relative group ${userRole === "admin" ? "cursor-pointer" : "cursor-default"}`;
          const layers = [];

          let isDraftActive = false;
          if (userRole === "admin" && inputMode === "date" && rangeStart) {
            const currentD = new Date(dateKey);
            const startD = new Date(rangeStart);
            const endD = rangeEnd ? new Date(rangeEnd) : new Date(rangeStart);
            if (currentD >= startD && currentD <= endD) {
              isDraftActive = true;
              let draftBg =
                "absolute inset-0 bg-blue-300 opacity-40 pointer-events-none ";
              if (
                dateKey === rangeStart &&
                dateKey === (rangeEnd || rangeStart)
              )
                draftBg += "rounded-sm md:rounded-md ";
              else if (dateKey === rangeStart)
                draftBg += "rounded-l-sm md:rounded-l-md ";
              else if (dateKey === rangeEnd)
                draftBg += "rounded-r-sm md:rounded-r-md ";
              layers.push(<div key="draft-bg" className={draftBg}></div>);

              let ringStyle = "absolute inset-0 pointer-events-none ";
              if (
                dateKey === rangeStart &&
                dateKey === (rangeEnd || rangeStart)
              )
                ringStyle +=
                  "ring-[1px] md:ring-[1.5px] ring-blue-500 rounded-sm md:rounded-md z-20 ";
              else if (dateKey === rangeStart)
                ringStyle +=
                  "ring-[1px] md:ring-[1.5px] ring-blue-500 rounded-l-sm md:rounded-l-md z-20 ";
              else if (dateKey === rangeEnd)
                ringStyle +=
                  "ring-[1px] md:ring-[1.5px] ring-blue-500 rounded-r-sm md:rounded-r-md z-20 ";
              else
                ringStyle +=
                  "border-y-[1px] md:border-y-[1.5px] border-blue-500 z-20 ";
              layers.push(<div key="draft-ring" className={ringStyle}></div>);
            }
          }

          dayTrainings.forEach((t, idx) => {
            const isStart = isSameDate(dateKey, t.startDate);
            const isEnd = isSameDate(dateKey, t.endDate);
            let layerStyle = `absolute inset-0 opacity-40 ${getStatusBgColor(t.status)} pointer-events-none `;
            if (isStart && isEnd) layerStyle += "rounded-sm ";
            else if (isStart) layerStyle += "rounded-l-sm ";
            else if (isEnd) layerStyle += "rounded-r-sm ";
            layers.push(
              <div
                key={`t-${idx}`}
                className={layerStyle}
                style={{ mixBlendMode: "multiply" }}
              ></div>,
            );
          });

          let textStyle = "relative z-10 pointer-events-none ";
          if (isSunday) textStyle += "text-red-600 font-bold ";
          else if (isDraftActive || dayTrainings.length > 0)
            textStyle += "text-slate-900 font-bold ";
          else
            textStyle += "text-slate-700 font-medium group-hover:text-black ";

          if (
            !isDraftActive &&
            dayTrainings.length === 0 &&
            userRole === "admin"
          )
            cellStyle += "hover:bg-slate-100 ";

          weekCells.push(
            <div
              key={dateKey}
              onClick={() => handleDateClick(dateKey)}
              className={cellStyle}
            >
              {layers}
              <span className={textStyle}>{dayCounter}</span>
            </div>,
          );
          dayCounter++;
        }
      }

      rows.push(
        <div
          key={`row-${i}`}
          className="grid grid-cols-[18px_repeat(7,1fr)] sm:grid-cols-[22px_repeat(7,1fr)] md:grid-cols-[25px_repeat(7,1fr)] border-b border-slate-50 last:border-0 flex-1 min-h-[22px]"
        >
          {weekCells}
        </div>,
      );
      currentWeekNum++;
      if (dayCounter > totalDays) break;
    }
    return rows;
  };

  return (
    <div className="h-full w-full flex flex-col gap-3 md:gap-4 p-2 md:p-5 overflow-y-auto bg-[#f1f5f9] custom-scrollbar font-sans pb-10 relative">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-3 shrink-0">
        <h1 className="text-3xl md:text-4xl font-black text-[#d32f2f] tracking-tighter">
          2026
        </h1>
        <div className="bg-white px-4 py-2 md:px-5 md:py-2.5 rounded-full shadow-sm border border-slate-200 flex flex-wrap gap-3 md:gap-5 items-center">
          {["Plan", "Actual", "Cancelled", "On Hold"].map((label, idx) => (
            <div
              key={label}
              className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-tight"
            >
              <div
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${[getStatusColor("plan"), getStatusColor("actual"), getStatusColor("cancelled"), getStatusColor("hold")][idx].split(" ")[0]}`}
              ></div>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* GRID KALENDER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3 shrink-0 w-full auto-rows-fr">
        {months.map((month, i) => (
          <div
            key={month}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 md:p-3 flex flex-col h-full transition hover:shadow-md"
          >
            <h3 className="text-sm md:text-lg font-black text-slate-800 border-b-2 border-slate-800 pb-0.5 md:pb-1 mb-1 md:mb-2 uppercase shrink-0">
              {month}{" "}
              <span className="text-slate-300 font-medium text-[10px] md:text-sm">
                2026
              </span>
            </h3>
            <div className="grid grid-cols-[18px_repeat(7,1fr)] sm:grid-cols-[22px_repeat(7,1fr)] md:grid-cols-[25px_repeat(7,1fr)] text-[6px] md:text-[8px] font-black text-slate-400 mb-1 border-b border-slate-100 shrink-0">
              <div></div>
              {days.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-1">{renderDays(2026, i)}</div>
          </div>
        ))}
      </div>

      {/* SECTION FORM & DETAILS */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mt-2 w-full shrink-0">
        {/* 🔥 TAMPILKAN INPUT FORM HANYA UNTUK ADMIN */}
        {userRole === "admin" && (
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-md w-full lg:w-[32%] flex flex-col h-fit">
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-3">
              <div className="flex items-center gap-1.5 shrink-0 min-w-min">
                <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-tight whitespace-nowrap">
                  Input Training
                </h2>
                <div className="flex gap-1 md:gap-1.5 ml-1 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
              </div>

              <div className="flex gap-1.5 md:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode("date");
                    setRangeStart(null);
                    setRangeEnd(null);
                    setForm({
                      ...form,
                      dateRange: "",
                      startDate: "",
                      endDate: "",
                    });
                  }}
                  className={`text-[8px] md:text-[9px] px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black transition shadow-sm ${inputMode === "date" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                >
                  BY DATE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode("week");
                    setRangeStart(null);
                    setRangeEnd(null);
                    setForm({
                      ...form,
                      dateRange: "",
                      startDate: "",
                      endDate: "",
                    });
                  }}
                  className={`text-[8px] md:text-[9px] px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black transition shadow-sm ${inputMode === "week" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                >
                  BY WEEK
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 md:gap-4 text-[11px]"
            >
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                  Training Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter training title..."
                  className="w-full border border-slate-200 rounded-lg p-2 md:p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 font-bold transition hover:border-blue-400 shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {inputMode === "date" ? (
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                      Date Selection
                    </label>
                    <input
                      name="dateRange"
                      value={form.dateRange}
                      readOnly
                      placeholder="Click on calendar above"
                      className="w-full border border-slate-200 rounded-lg p-2 md:p-2.5 bg-blue-50/50 text-blue-700 font-bold shadow-inner h-[36px] md:h-[38px]"
                      required
                    />
                  </div>
                ) : (
                  <div className="col-span-2 relative z-50">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                      Select Week
                    </label>
                    <CustomSelect
                      name="weekNumber"
                      value={form.weekNumber}
                      onChange={handleChange}
                      placeholder="-- Choose a week --"
                      options={Array.from({ length: 53 }, (_, i) => i + 1).map(
                        (w) => ({
                          value: String(w),
                          label: getDateRangeFromWeek(w, 2026).label,
                        }),
                      )}
                    />
                    <p className="text-[8px] text-slate-400 mt-1.5 uppercase font-bold tracking-widest pl-1">
                      {form.dateRange ||
                        "Resulting date range will appear here"}
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-40">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                    Training Type
                  </label>
                  <CustomSelect
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Select Type"
                    options={[
                      {
                        value: "LinkedIn Learning",
                        label: "LinkedIn Learning",
                      },
                      { value: "Internal", label: "Internal" },
                      { value: "External", label: "External" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                    Status
                  </label>
                  <CustomSelect
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    placeholder="Select Status"
                    options={[
                      { value: "plan", label: "Plan" },
                      { value: "actual", label: "Actual" },
                      { value: "hold", label: "On Hold" },
                      { value: "cancelled", label: "Cancelled" },
                    ]}
                  />
                </div>
              </div>

              <div className="relative z-30">
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                  Participants (From Employee List)
                </label>
                <CascadingEmployeeSelect
                  employeesData={employeesList}
                  selectedParticipants={form.participants}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#2563eb] text-white font-black py-3 md:py-4 rounded-xl hover:bg-blue-700 transition active:scale-95 uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200"
              >
                Add Training to Schedule
              </button>
            </form>
          </div>
        )}

        {/* DETAILS TABLE (KANAN) */}
        {/* 🔥 SESUAIKAN LEBAR TABEL BILA VIEWER */}
        <div
          className={`bg-white rounded-2xl border border-slate-200 shadow-md p-4 md:p-5 flex flex-col h-[350px] md:h-[450px] transition-all duration-300 ${userRole === "admin" ? "w-full lg:w-[68%]" : "w-full"}`}
        >
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 shrink-0">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Training Details
            </h2>
            <div className="flex gap-1.5 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            </div>
          </div>
          <div className="flex-1 overflow-auto rounded-xl border border-slate-100 custom-scrollbar">
            <table className="w-full min-w-[700px] text-[11px] text-left">
              <thead className="bg-[#d32f2f] text-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider">
                    Training Title
                  </th>
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider text-center">
                    Date / Week
                  </th>
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider text-center">
                    Type
                  </th>
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider max-w-[200px]">
                    Participants
                  </th>
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse"
                    >
                      Loading data from Google Sheets...
                    </td>
                  </tr>
                ) : trainings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest"
                    >
                      No schedule added yet
                    </td>
                  </tr>
                ) : (
                  trainings.map((t, index) => (
                    <tr
                      key={index}
                      onClick={() => setSelectedTraining(t)}
                      className="hover:bg-blue-50/80 transition cursor-pointer active:scale-[0.99]"
                    >
                      <td className="p-3 md:p-4 font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {t.title}
                      </td>
                      <td className="p-3 md:p-4 text-center text-slate-500 font-bold">
                        {t.dateRange}
                      </td>
                      <td className="p-3 md:p-4 text-center font-bold text-slate-600">
                        {t.type}
                      </td>
                      <td
                        className="p-3 md:p-4 font-medium text-slate-700 max-w-[200px] truncate"
                        title={t.participants}
                      >
                        {t.participants}
                      </td>
                      <td className="p-3 md:p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm ${getStatusColor(t.status)}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL POP-UP DETAIL TRAINING */}
      {/* ========================================== */}
      {isMounted &&
        selectedTraining &&
        createPortal(
          <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4 pointer-events-auto">
            {/* Latar Hitam Blur */}
            <div
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"
              onClick={() => setSelectedTraining(null)}
            ></div>

            {/* Kotak Modal */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              {/* Header Modal */}
              <div className="bg-slate-50 border-b border-slate-100 p-5 flex justify-between items-start gap-4">
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-sm mb-2 ${getStatusColor(selectedTraining.status)}`}
                  >
                    {selectedTraining.status}
                  </span>
                  <h3 className="font-black text-slate-800 text-lg md:text-xl leading-tight">
                    {selectedTraining.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTraining(null)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shrink-0 shadow-sm"
                >
                  ✕
                </button>
              </div>

              {/* Konten Modal */}
              <div className="p-5 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block mb-1">
                      Date / Week
                    </span>
                    <p className="font-bold text-slate-700 text-xs">
                      {selectedTraining.dateRange}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block mb-1">
                      Training Type
                    </span>
                    <p className="font-bold text-slate-700 text-xs">
                      {selectedTraining.type}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col h-full min-h-[100px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      Participants List
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-[9px] font-bold">
                      {
                        selectedTraining.participants.split(",").filter(Boolean)
                          .length
                      }{" "}
                      People
                    </span>
                  </div>

                  {/* 🔥 Daftar Partisipan dengan Nama Departemen */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 max-h-[180px] overflow-y-auto custom-scrollbar shadow-inner">
                    {selectedTraining.participants ? (
                      <ul className="list-none space-y-1">
                        {selectedTraining.participants
                          .split(",")
                          .filter(Boolean)
                          .map((p, i) => {
                            const empName = p.trim();
                            // Mencari kecocokan nama dengan data dari Employee List
                            const foundEmp = employeesList.find(
                              (e) =>
                                e.name.toLowerCase() === empName.toLowerCase(),
                            );
                            const dept = foundEmp ? foundEmp.department : null;

                            return (
                              <li
                                key={i}
                                className="flex items-center justify-between gap-2 text-slate-700 font-medium text-[11px] md:text-xs p-1.5 hover:bg-slate-50 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#d32f2f] shrink-0"></div>
                                  <span
                                    className="truncate group-hover:text-blue-700 transition-colors"
                                    title={empName}
                                  >
                                    {empName}
                                  </span>
                                </div>
                                {dept ? (
                                  <span className="text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200 bg-white shadow-sm text-slate-500 whitespace-nowrap shrink-0 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                                    {dept}
                                  </span>
                                ) : (
                                  <span className="text-[8px] md:text-[9px] font-medium px-2 py-0.5 text-slate-300 whitespace-nowrap shrink-0">
                                    -
                                  </span>
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic text-xs block p-2 text-center">
                        No participants assigned yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setSelectedTraining(null)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl transition-colors text-[11px] uppercase tracking-widest"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
