"use client";

import React from "react";
import { Home, PieChart, ClipboardList, Grid, Calendar, X } from "lucide-react";

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  activePage,
  setActivePage,
}) {
  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: <Home size={20} />,
      activeClass:
        "bg-slate-200 text-slate-800 font-bold border-l-4 border-slate-500",
      hoverClass: "hover:bg-slate-100 hover:text-slate-700",
    },
    {
      id: "mandays",
      label: "Training Mandays",
      icon: <PieChart size={20} />,
      activeClass:
        "bg-[#000ebf]/10 text-[#000ebf] font-bold border-l-4 border-[#000ebf]",
      hoverClass: "hover:bg-blue-50 hover:text-[#000ebf]",
    },
    {
      id: "training-plan",
      label: "Training Plan",
      icon: <ClipboardList size={20} />,
      activeClass:
        "bg-[#65a30d]/15 text-[#4d7c0f] font-bold border-l-4 border-[#65a30d]",
      hoverClass: "hover:bg-[#65a30d]/10 hover:text-[#4d7c0f]",
    },
    {
      id: "matrix-competency",
      label: "Matrix Competency",
      icon: <Grid size={20} />,
      activeClass:
        "bg-red-100 text-[#dc2626] font-bold border-l-4 border-[#dc2626]",
      hoverClass: "hover:bg-red-50 hover:text-[#dc2626]",
    },
    {
      id: "training-calendar",
      label: "Training Calendar",
      icon: <Calendar size={20} />,
      activeClass:
        "bg-[#000ebf]/10 text-[#000ebf] font-bold border-l-4 border-[#000ebf]",
      hoverClass: "hover:bg-blue-50 hover:text-[#000ebf]",
    },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileOpen(false);

    // Delay disamakan dengan durasi animasi yang baru (300ms) agar terasa snappy
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 300);
  };

  return (
    <>
      {/* 1. LAYER BACKDROP (Layar Gelap Transparan) */}
      {/* 🔥 FIX: Hapus backdrop-blur dan ubah durasi ke 300ms agar sangat ringan di HP */}
      <div
        className={`fixed inset-0 bg-[#0f172a]/40 z-[99995] transition-opacity duration-300 ease-out md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* 2. LACI SIDEBAR (Slide dari Kanan) */}
      {/* 🔥 FIX: Durasi dipercepat jadi 300ms & tambah will-change untuk Hardware Acceleration */}
      <aside
        className={`fixed top-0 right-0 h-[100dvh] w-[280px] bg-white shadow-2xl z-[99999] transform transition-transform duration-300 ease-out flex flex-col ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ willChange: "transform" }}
      >
        {/* HEADER SIDEBAR */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          {/* 🔥 FIX: Menggunakan Logo Filtrona Colorg sesuai permintaan */}
          <img
            src="/filtrona-logo-colorg.png"
            alt="Filtrona"
            className="h-6 object-contain"
            onError={(e) => {
              e.target.src =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_p_G5_JpQ2ZfE9J9m9P9P9P9P9P9P9P9P9A&s";
            }}
          />

          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors active:scale-95"
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* LIST TOMBOL MENU */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-4 w-full p-3.5 rounded-lg transition-all duration-300 text-sm overflow-hidden relative ${
                  isActive
                    ? item.activeClass
                    : `text-slate-500 border-l-4 border-transparent ${item.hoverClass}`
                }`}
              >
                <div
                  className={`${isActive ? "scale-110" : "scale-100"} transition-transform duration-300`}
                >
                  {item.icon}
                </div>
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
