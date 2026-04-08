"use client";

import React, { useState, useEffect, useRef } from "react";

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

// ==========================================
// HELPER FUNCTIONS
// ==========================================
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

// ==========================================
// CUSTOM SELECT COMPONENT
// ==========================================
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
        className={`w-full border rounded-lg p-2 bg-white flex items-center justify-between cursor-pointer transition shadow-sm ${isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200 hover:border-blue-400"}`}
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

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function TrainingCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [inputMode, setInputMode] = useState("date");

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

          // 🔥 Ukuran font HP diperkecil ke text-[8px] agar tidak nabrak
          let cellStyle =
            "cursor-pointer text-[8px] md:text-[9px] text-center h-full w-full flex items-center justify-center transition relative group ";
          const layers = [];

          let isDraftActive = false;
          if (inputMode === "date" && rangeStart) {
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

          if (!isDraftActive && dayTrainings.length === 0)
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

      // 🔥 FIX: flex-1 dipastikan bekerja untuk meregangkan tiap baris hari dengan sama rata
      // 🔥 FIX: Ukuran kolom W di HP diperkecil jadi 18px (sebelumnya 25px) agar hari-hari punya lebih banyak ruang
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
    <div className="h-full w-full flex flex-col gap-3 md:gap-4 p-2 md:p-5 overflow-y-auto bg-[#f1f5f9] custom-scrollbar font-sans pb-10">
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
      {/* 🔥 FIX: auto-rows-fr memastikan SEMUA box kalender bulan punya tinggi yang SAMA PERSIS */}
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
            {/* 🔥 FIX: flex-1 flex-col memastikan hari-hari di dalam memenuhi ruang sisa secara sama rata */}
            <div className="flex flex-col flex-1">{renderDays(2026, i)}</div>
          </div>
        ))}
      </div>

      {/* SECTION FORM & DETAILS */}
      <div className="flex flex-col lg:flex-row gap-3 md:gap-4 mt-2 w-full shrink-0">
        {/* INPUT FORM (KIRI) */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-md w-full lg:w-[32%] flex flex-col h-fit">
          {/* 🔥 FIX: flex-wrap dan penataan ulang agar judul panjang tidak menabrak titik dan tombol di layar HP sempit */}
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
                    className="w-full border border-slate-200 rounded-lg p-2 md:p-2.5 bg-blue-50/50 text-blue-700 font-bold shadow-inner"
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
                  <p className="text-[8px] text-slate-400 mt-1.5 uppercase font-bold tracking-widest">
                    {form.dateRange || "Resulting date range will appear here"}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-40">
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
                    { value: "LinkedIn Learning", label: "LinkedIn Learning" },
                    { value: "Internal", label: "Internal" },
                    { value: "External", label: "External" },
                  ]}
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1.5">
                  Participants
                </label>
                <input
                  name="participants"
                  value={form.participants}
                  onChange={handleChange}
                  placeholder="Names or Qty..."
                  className="w-full border border-slate-200 rounded-lg p-2 md:p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700 transition hover:border-blue-400 shadow-sm h-[36px] md:h-[38px]"
                  required
                />
              </div>
            </div>

            <div className="relative z-30">
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

            <button
              type="submit"
              className="mt-2 bg-[#2563eb] text-white font-black py-3 md:py-4 rounded-xl hover:bg-blue-700 transition active:scale-95 uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200"
            >
              Add Training to Schedule
            </button>
          </form>
        </div>

        {/* DETAILS TABLE (KANAN) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 md:p-5 w-full lg:w-[68%] flex flex-col h-[350px] md:h-[450px]">
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
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="p-3 md:p-4 font-bold uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {trainings.length === 0 ? (
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
                    <tr key={index} className="hover:bg-blue-50/50 transition">
                      <td className="p-3 md:p-4 font-bold text-slate-900">
                        {t.title}
                      </td>
                      <td className="p-3 md:p-4 text-center text-slate-500 font-bold">
                        {t.dateRange}
                      </td>
                      <td className="p-3 md:p-4 text-center font-bold text-slate-600">
                        {t.type}
                      </td>
                      <td className="p-3 md:p-4 font-medium text-slate-700">
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
