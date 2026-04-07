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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  function handleDateClick(date) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);

      setForm({
        ...form,
        startDate: date,
        endDate: date,
        dateRange: date,
      });
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

    // Kotak kosong sebelum tanggal 1
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${monthIndex}-${i}`}></div>);
    }

    // Tanggal aktual
    for (let d = 1; d <= totalDays; d++) {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const training = trainings.find((t) =>
        isDateInRange(dateKey, t.startDate, t.endDate),
      );

      let style =
        "cursor-pointer text-[10px] text-center py-0.5 transition hover:bg-gray-100 flex items-center justify-center";

      if (training) {
        const isStart = isSameDate(dateKey, training.startDate);
        const isEnd = isSameDate(dateKey, training.endDate);

        if (isStart && isEnd) {
          style += ` ${getStatusColor(training.status)} rounded font-bold`;
        } else if (isStart) {
          style += ` ${getStatusColor(training.status)} rounded-l font-bold`;
        } else if (isEnd) {
          style += ` ${getStatusColor(training.status)} rounded-r font-bold`;
        } else {
          style += ` ${getStatusColor(training.status)} rounded-none`;
        }
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
    // 🔥 PERBAIKAN: Menggunakan h-full flex flex-col overflow-hidden agar tidak tumpah/scroll di luar
    <div className="h-full w-full flex flex-col gap-2 p-2 md:p-3 overflow-hidden font-sans bg-transparent">
      {/* ================= CALENDAR GRID (ATAS) ================= */}
      {/* 🔥 shrink-0 memastikan kalender tidak penyok, grid-cols-6 memaksanya jadi 2 baris saja */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 shrink-0">
        {months.map((month, i) => (
          <div
            key={month}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-1.5 flex flex-col"
          >
            <h3 className="text-[11px] font-bold text-slate-800 mb-1 border-b border-slate-100 pb-0.5">
              {month} 2026
            </h3>

            {/* Header Hari */}
            <div className="grid grid-cols-7 text-[8px] font-bold text-slate-400 mb-0.5">
              {days.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid Tanggal */}
            <div className="grid grid-cols-7 flex-1">{renderDays(2026, i)}</div>
          </div>
        ))}
      </div>

      {/* ================= FORM & TABLE (BAWAH) ================= */}
      {/* 🔥 flex-1 min-h-0 agar mengisi sisa ruang layar dan tidak membesar */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3">
        {/* INPUT FORM (KIRI) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm w-full lg:w-[25%] flex flex-col shrink-0 overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-800 mb-3 border-b border-slate-100 pb-1.5">
            Input Training
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2.5 text-[11px]"
          >
            <div>
              <label className="text-[9px] font-semibold text-slate-500 uppercase">
                Training Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
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
                className="w-full border border-slate-300 rounded p-1.5 bg-slate-50 text-slate-500 cursor-not-allowed mt-0.5"
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
                  className="w-full border border-slate-300 rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
                  required
                />
              </div>
              <div>
                <label className="text-[9px] font-semibold text-slate-500 uppercase">
                  Qty / Pax
                </label>
                <input
                  name="participants"
                  value={form.participants}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500 mt-0.5"
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
                className="w-full border border-slate-300 rounded p-1.5 outline-none focus:ring-1 focus:ring-blue-500 font-medium mt-0.5"
              >
                <option value="plan">Plan</option>
                <option value="actual">Actual</option>
                <option value="hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-1 bg-[#2563eb] text-white font-bold rounded p-2 hover:bg-blue-700 transition active:scale-[0.98]"
            >
              Add to Calendar
            </button>
          </form>
        </div>

        {/* TRAINING LIST DETAILS (KANAN) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex-1 flex flex-col min-w-0">
          <h2 className="text-xs font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1.5">
            Training List
          </h2>

          {/* 🔥 Container ini yang akan ber-scroll jika tabelnya panjang */}
          <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-200 rounded-lg">
            <table className="w-full min-w-[560px] text-[11px] text-left">
              <thead className="bg-[#dc2626] text-white sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-2 font-semibold">Training Title</th>
                  <th className="p-2 font-semibold">Start</th>
                  <th className="p-2 font-semibold">End</th>
                  <th className="p-2 font-semibold">Type</th>
                  <th className="p-2 font-semibold">Pax</th>
                  <th className="p-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {trainings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-6 text-center text-slate-400 italic"
                    >
                      No trainings added yet. Select dates on the calendar
                      above.
                    </td>
                  </tr>
                ) : (
                  trainings.map((t, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 hover:bg-slate-50 transition"
                    >
                      <td className="p-2 font-medium text-slate-900 truncate max-w-[150px]">
                        {t.title}
                      </td>
                      <td className="p-2">{t.startDate}</td>
                      <td className="p-2">{t.endDate}</td>
                      <td className="p-2">{t.type}</td>
                      <td className="p-2">{t.participants}</td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusColor(t.status)}`}
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
    </div>
  );
}
