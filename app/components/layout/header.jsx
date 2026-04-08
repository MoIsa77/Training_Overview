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
    "training-calendar": "Training Calendar 2026",
  };

  return (
    <header
      // 🔥 FIX: Transisi bg-transparent akan dipaksa saat isHome true
      className={`fixed top-0 left-0 w-full z-[9990] h-[60px] md:h-[70px] flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
        isHome
          ? "bg-transparent border-none shadow-none"
          : "bg-[#1e3b8a] shadow-lg"
      }`}
    >
      <div className="flex items-center gap-4 md:gap-6">
        {/* LOGO FILTRONA */}
        <img
          src="/filtrona-logo-color.png"
          alt="Filtrona"
          className="h-5 md:h-6 object-contain"
          onError={(e) => {
            e.target.src =
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_p_G5_JpQ2ZfE9J9m9P9P9P9P9P9P9P9P9A&s";
          }}
        />

        {/* JUDUL & GARIS (Hanya jika BUKAN di Home) */}
        {!isHome && (
          <>
            <div className="h-6 w-[1px] bg-white/20 hidden md:block"></div>
            <h1 className="text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] truncate max-w-[150px] md:max-w-none opacity-90">
              {pageTitles[activePage] || ""}
            </h1>
          </>
        )}
      </div>

      <div className="flex items-center gap-5 md:gap-8">
        {/* TOMBOL RESET FILTER (Hanya jika BUKAN di Home) */}
        {!isHome && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all group"
          >
            <RotateCcw
              size={23}
              className="group-hover:-rotate-180 transition duration-500 ease-out"
            />
          </button>
        )}

        <button
          onClick={() => setMobileOpen(true)}
          className={`p-2 rounded-lg transition-all duration-300 ${
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
