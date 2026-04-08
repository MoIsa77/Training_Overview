"use client";

import React from "react";
import { MenuIcon, RotateCcw } from "lucide-react";

export default function Header({
  setMobileOpen,
  isHome,
  resetFilters,
  activePage,
}) {
  const pageTitles = {
    home: "",
    mandays: "Mandays Training",
    "training-plan": "Training Plan",
    "matrix-competency": "Matrix Competency",
    "training-calendar": "Training Calendar",
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[9990] h-[60px] md:h-[70px] flex items-center justify-between px-6 md:px-10">
      {/* 🔥 FIX: Menggunakan duration-500 ease-in-out agar transisi fade masuk dan keluar seimbang & reaktif! */}
      <div
        className={`absolute inset-0 bg-[#1e3a8a] border-b border-blue-800 shadow-lg shadow-blue-900/40 backdrop-blur-md transition-opacity duration-500 ease-in-out pointer-events-none ${
          isHome ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* ================= KIRI: LOGO & JUDUL PAGE ================= */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        <img
          src="/filtrona-logo-color.png"
          alt="Filtrona"
          className={`h-5 md:h-6 object-contain transition-all duration-500 ease-in-out ${
            isHome ? "brightness-0 invert opacity-90" : "brightness-100"
          }`}
          onError={(e) => {
            e.target.src =
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_p_G5_JpQ2ZfE9J9m9P9P9P9P9P9P9P9P9A&s";
          }}
        />

        <div
          className={`flex items-center gap-4 md:gap-6 transition-all duration-500 ease-in-out ${
            isHome
              ? "opacity-0 -translate-x-4 pointer-events-none absolute left-full"
              : "opacity-100 translate-x-0 relative left-auto"
          }`}
        >
          <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>
          <h1 className="text-white font-black text-s md:text-sm uppercase tracking-[0.2em] truncate max-w-[150px] md:max-w-none opacity-90">
            {pageTitles[activePage] || "Mandays Training"}
          </h1>
        </div>
      </div>

      {/* ================= KANAN: TOMBOL AKSI ================= */}
      <div className="relative z-10 flex items-center gap-5 md:gap-8">
        <div
          className={`transition-all duration-500 ease-in-out flex items-center ${
            isHome
              ? "opacity-0 translate-x-2 pointer-events-none absolute right-full"
              : "opacity-100 translate-x-0 relative right-auto"
          }`}
        >
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <RotateCcw
              size={20}
              className="group-hover:-rotate-180 transition-transform duration-500 ease-out"
            />
          </button>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className={`p-2 rounded-lg transition-colors duration-300 ${
            isHome
              ? "text-white hover:bg-white/10"
              : "text-white hover:bg-blue-800/50"
          }`}
        >
          <MenuIcon size={28} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
