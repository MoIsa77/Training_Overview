"use client";

import React, { useState } from "react";

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

function getStatusColor(status) {
  switch (status) {
    case "plan":
      return "bg-blue-200 text-blue-800";
    case "actual":
      return "bg-green-200 text-green-800";
    case "cancelled":
      return "bg-red-200 text-red-800";
    case "hold":
      return "bg-gray-200 text-gray-800";
    default:
      return "";
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

export default function TrainingCalendar() {
  const [trainings, setTrainings] = useState([]);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  const [form, setForm] = useState({
    title: "",
    dateRange: "",
    startDate: "",
    endDate: "",
    type: "",
    participants: "",
    status: "plan",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  function handleDateClick(date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      setForm({ ...form, startDate: date, endDate: date, dateRange: date });
    } else {
      if (new Date(date) < new Date(rangeStart)) {
        setRangeStart(date);
        setForm({
          ...form,
          startDate: date,
          endDate: rangeStart,
          dateRange: `${date} - ${rangeStart}`,
        });
      } else {
        setRangeEnd(date);
        setForm({
          ...form,
          startDate: rangeStart,
          endDate: date,
          dateRange: `${rangeStart} - ${date}`,
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
      type: "",
      participants: "",
      status: "plan",
    });
    setRangeStart(null);
    setRangeEnd(null);
  };

  const renderDays = (year, monthIndex) => {
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${monthIndex}-${i}`}></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const training = trainings.find((t) =>
        isDateInRange(dateKey, t.startDate, t.endDate),
      );
      let style =
        "cursor-pointer text-[10px] text-center py-1 transition hover:bg-gray-100 flex items-center justify-center";

      if (training) {
        const isStart = isSameDate(dateKey, training.startDate);
        const isEnd = isSameDate(dateKey, training.endDate);
        if (isStart && isEnd)
          style += ` ${getStatusColor(training.status)} rounded font-bold`;
        else if (isStart)
          style += ` ${getStatusColor(training.status)} rounded-l font-bold`;
        else if (isEnd)
          style += ` ${getStatusColor(training.status)} rounded-r font-bold`;
        else style += ` ${getStatusColor(training.status)} rounded-none`;
      }

      if (rangeStart && !rangeEnd && isSameDate(dateKey, rangeStart)) {
        style += " ring-1 ring-blue-500 rounded bg-blue-50";
      }

      cells.push(
        <div
          key={`day-${monthIndex}-${d}`}
          onClick={() => handleDateClick(dateKey)}
          className={style}
        >
          <span>{d}</span>
        </div>,
      );
    }
    return cells;
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 p-3 md:p-4 overflow-y-auto lg:overflow-hidden bg-[#f8fafc] custom-scrollbar">
      {/* GRID KALENDER (ATAS) */}
      {/* Di Desktop kita kasih max-height agar tidak menekan form di bawahnya */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 shrink-0 lg:max-h-[45%] overflow-y-auto pr-1 custom-scrollbar">
        {months.map((month, i) => (
          <div
            key={month}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-2 flex flex-col h-[155px]"
          >
            <h3 className="text-[11px] font-bold text-slate-800 mb-1 border-b border-slate-100 pb-1 uppercase italic">
              {month} 2026
            </h3>
            <div className="grid grid-cols-7 text-[8px] font-bold text-slate-400 mb-1">
              {days.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1">{renderDays(2026, i)}</div>
          </div>
        ))}
      </div>

      {/* SECTION FORM & TABEL (BAWAH) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 lg:overflow-hidden">
        {/* INPUT FORM (KIRI) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full lg:w-[28%] flex flex-col shrink-0 lg:overflow-y-auto custom-scrollbar">
          <h2 className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 uppercase italic shrink-0">
            Input Training
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 text-[11px]"
          >
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase">
                Training Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase">
                Date Range
              </label>
              <input
                name="dateRange"
                placeholder="Click calendar to select"
                value={form.dateRange}
                readOnly
                className="w-full border border-slate-300 rounded p-2 bg-slate-50 text-slate-500 italic mt-1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-semibold text-slate-500 uppercase">
                  Type
                </label>
                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-semibold text-slate-500 uppercase">
                  Pax
                </label>
                <input
                  name="participants"
                  value={form.participants}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded p-2 outline-none focus:ring-1 focus:ring-blue-500 mt-1"
              >
                <option value="plan">Plan</option>
                <option value="actual">Actual</option>
                <option value="hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-2 bg-[#2563eb] text-white font-bold rounded-lg py-2.5 hover:bg-blue-700 transition active:scale-95 uppercase text-[10px] shrink-0"
            >
              Add to Calendar
            </button>
          </form>
        </div>

        {/* TRAINING LIST TABLE (KANAN) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1 flex flex-col min-h-[300px] lg:min-h-0">
          <h2 className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 uppercase italic shrink-0">
            Training List
          </h2>
          <div className="flex-1 overflow-auto border border-slate-100 rounded-lg bg-slate-50/50 custom-scrollbar">
            <table className="w-full min-w-[500px] text-[10px] md:text-[11px] text-left">
              <thead className="bg-[#dc2626] text-white sticky top-0 z-10 uppercase italic">
                <tr>
                  <th className="p-2.5">Title</th>
                  <th className="p-2.5 text-center">Start</th>
                  <th className="p-2.5 text-center">End</th>
                  <th className="p-2.5 text-center">Type</th>
                  <th className="p-2.5 text-center">Pax</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {trainings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-slate-400 italic"
                    >
                      No trainings added yet.
                    </td>
                  </tr>
                ) : (
                  trainings.map((t, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 bg-white hover:bg-slate-50 transition"
                    >
                      <td className="p-2.5 font-bold text-slate-900 truncate max-w-[150px]">
                        {t.title}
                      </td>
                      <td className="p-2.5 text-center text-slate-500">
                        {t.startDate}
                      </td>
                      <td className="p-2.5 text-center text-slate-500">
                        {t.endDate}
                      </td>
                      <td className="p-2.5 text-center">{t.type}</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">
                        {t.participants}
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getStatusColor(t.status)}`}
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

      {/* Spacer bawah untuk mobile */}
      <div className="h-10 lg:hidden shrink-0"></div>
    </div>
  );
}
