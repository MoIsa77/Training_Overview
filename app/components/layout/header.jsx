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
    mandays: "Corporate Training Overview",
    "training-plan": "Training Plan",
    "training-calendar": "Training Calendar 2026",
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[9990] h-[60px] md:h-[70px] flex items-center justify-between px-6 md:px-10">
      {/* 🔥 FIX 1: Trik GPU Acceleration. Background selalu biru & blur, tapi kita atur OPACITY-nya saja. 
          Durasi diturunkan ke 400ms (duration-400) agar responsif dan tidak terasa delay! */}
      <div
        className={`absolute inset-0 bg-[#1e3a8a] border-b border-blue-800 shadow-lg shadow-blue-900/40 backdrop-blur-md transition-opacity duration-500 ease-out pointer-events-none ${
          isHome ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* ================= KIRI: LOGO & JUDUL PAGE ================= */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        <img
          src="/filtrona-logo.png"
          alt="Filtrona"
          className={`h-5 md:h-6 object-contain transition-all duration-500 ease-out ${
            isHome ? "brightness-0 invert opacity-90" : "brightness-100"
          }`}
          onError={(e) => {
            e.target.src =
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_p_G5_JpQ2ZfE9J9m9P9P9P9P9P9P9P9P9A&s";
          }}
        />

        {/* 🔥 FIX 2: Teks tidak langsung dihapus, tapi dibuat memudar (fade-out) bersama background */}
        <div
          className={`flex items-center gap-4 md:gap-6 transition-all duration-500 ease-out ${
            isHome
              ? "opacity-0 -translate-x-4 pointer-events-none absolute left-full"
              : "opacity-100 translate-x-0 relative left-auto"
          }`}
        >
          <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>
          <h1 className="text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] truncate max-w-[150px] md:max-w-none opacity-90">
            {pageTitles[activePage] || "Corporate Training Overview"}
          </h1>
        </div>
      </div>

      {/* ================= KANAN: TOMBOL AKSI ================= */}
      <div className="relative z-10 flex items-center gap-5 md:gap-8">
        {/* Tombol Reset juga dibuat memudar halus */}
        <div
          className={`transition-opacity duration-500 ease-out flex items-center ${
            isHome
              ? "opacity-0 pointer-events-none absolute right-full"
              : "opacity-100 relative right-auto"
          }`}
        >
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all group"
          >
            <RotateCcw
              size={15}
              className="group-hover:-rotate-180 transition duration-500 ease-out"
            />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest hidden md:block mt-0.5">
              Reset Filter
            </span>
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
