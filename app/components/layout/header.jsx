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
      {/* 🔥 FIX: Layer Background Terpisah Agar Animasi 100% Smooth */}
      {/* Layer ini murni hanya untuk transisi warna, shadow, dan blur */}
      <div
        className={`absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none ${
          isHome
            ? "bg-[#1e3a8a]/0 border-b border-transparent shadow-none backdrop-blur-none"
            : "bg-[#1e3a8a] border-b border-blue-800 shadow-lg shadow-blue-900/40 backdrop-blur-md"
        }`}
      ></div>

      {/* ================= KIRI: LOGO & JUDUL PAGE ================= */}
      {/* Tambahkan relative z-10 agar konten selalu di atas background */}
      <div className="relative z-10 flex items-center gap-4 md:gap-6">
        <img
          src="/filtrona-logo-color.png"
          alt="Filtrona"
          className={`h-5 md:h-6 object-contain transition-all duration-700 ease-in-out ${
            isHome ? "brightness-0 invert opacity-90" : "brightness-100"
          }`}
          onError={(e) => {
            e.target.src =
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_p_G5_JpQ2ZfE9J9m9P9P9P9P9P9P9P9P9A&s";
          }}
        />

        {!isHome && (
          <>
            <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>
            <h1 className="text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] truncate max-w-[150px] md:max-w-none opacity-90 animate-in fade-in slide-in-from-left-4 duration-500">
              {pageTitles[activePage] || ""}
            </h1>
          </>
        )}
      </div>

      {/* ================= KANAN: TOMBOL AKSI ================= */}
      <div className="relative z-10 flex items-center gap-5 md:gap-8">
        {!isHome && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all group animate-in fade-in duration-500"
          >
            <RotateCcw
              size={15}
              className="group-hover:-rotate-180 transition duration-700 ease-out"
            />
            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest hidden md:block mt-0.5">
              Reset Filter
            </span>
          </button>
        )}

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
