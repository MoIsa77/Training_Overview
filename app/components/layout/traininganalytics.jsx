"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

// 🔥 FIX 1: Menambahkan genderFilter ke dalam props penerima
export default function TrainingAnalytics({
  filters = {},
  genderFilter = "All",
}) {
  const [typeData, setTypeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  // 🔥 FIX 2: Menambahkan genderFilter ke dependency array agar chart update saat dropdown diklik
  useEffect(() => {
    fetchData();
  }, [filters, genderFilter]);

  async function fetchData() {
    try {
      const res = await fetch(
        "https://opensheet.elk.sh/1EkgLNCryuKRTt-0Lp5yfAUgjoc7vHNj-ZOdIScF2a1Y/Planned%20Training",
        { cache: "no-store" },
      );

      const data = await res.json();

      const safeCheck = (arr, val) => {
        if (val === null || val === undefined) return false;
        const strVal = String(val).toLowerCase().trim();
        return arr.some((item) => String(item).toLowerCase().trim() === strVal);
      };

      const filtered = data.filter((row) => {
        const department =
          row["Department"] || row["Dept"] || row["department"] || "";
        const trainingType =
          row["Type of Training"] ||
          row["Training Type"] ||
          row["TrainingType"] ||
          "";
        const category = row["Category"] || row["Training Category"] || "";
        const year = row["Year"] || row["Training Year"] || "";
        const month = row["Month"] || row["Training Month"] || "";

        // 🔥 Ambil data gender dari sheet
        const gender = row["Gender"] || row["Jenis Kelamin"] || "";

        if (
          filters?.department?.length > 0 &&
          !safeCheck(filters.department, department)
        )
          return false;
        if (
          filters?.trainingType?.length > 0 &&
          !safeCheck(filters.trainingType, trainingType)
        )
          return false;
        if (
          filters?.category?.length > 0 &&
          !safeCheck(filters.category, category)
        )
          return false;
        if (filters?.year?.length > 0 && !safeCheck(filters.year, year))
          return false;
        if (filters?.month?.length > 0 && !safeCheck(filters.month, month))
          return false;

        // 🔥 FIX 3: Saringan Gender
        if (genderFilter !== "All") {
          const g = String(gender).toLowerCase().trim();
          const isMale = g === "male" || g === "laki-laki" || g === "l";
          const isFemale = g === "female" || g === "perempuan" || g === "p";

          if (genderFilter === "Male" && !isMale) return false;
          if (genderFilter === "Female" && !isFemale) return false;
        }

        return true;
      });

      processTypeData(filtered);
      processCategoryData(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function processTypeData(data) {
    const result = {};

    data.forEach((item) => {
      const type = item["Type of Training"] || item["Training Type"] || "";
      const status = Number(item["Status"]) || 0;

      if (!type) return;

      if (!result[type]) {
        result[type] = {
          name: type,
          planned: 0,
          implemented: 0,
        };
      }

      if (status === 1 || status === 2) {
        result[type].implemented += 1;
      } else {
        result[type].planned += 1;
      }
    });

    setTypeData(Object.values(result));
  }

  function processCategoryData(data) {
    const result = {};

    data.forEach((item) => {
      const category = item["Category"] || item["Training Category"] || "";
      const status = Number(item["Status"]) || 0;

      if (!category) return;

      if (!result[category]) {
        result[category] = {
          name: category,
          planned: 0,
          implemented: 0,
        };
      }

      if (status === 1 || status === 2) {
        result[category].implemented += 1;
      } else {
        result[category].planned += 1;
      }
    });

    setCategoryData(Object.values(result));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full h-full min-h-0">
      {/* CARD 1: TRAINING BY TYPE */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col h-[300px] lg:h-full min-h-0 overflow-hidden">
        {/* 🔥 FIX: Judul dengan 3 Titik Warna */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
            TRAINING BY TYPE
          </h2>
          <div className="flex gap-1.5 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={typeData}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="planned" fill="#3b82f6" name="Planned" />
              <Bar dataKey="implemented" fill="#dc2626" name="Implemented" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD 2: TRAINING BY CATEGORY */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-3 md:p-4 flex flex-col h-[300px] lg:h-full min-h-0 overflow-hidden">
        {/* 🔥 FIX: Judul dengan 3 Titik Warna */}
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <h2 className="font-bold text-slate-800 text-xs md:text-sm tracking-wide uppercase">
            TRAINING BY CATEGORY
          </h2>
          <div className="flex gap-1.5 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={categoryData}
              margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="planned" fill="#3b82f6" name="Planned" />
              <Bar dataKey="implemented" fill="#dc2626" name="Implemented" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
