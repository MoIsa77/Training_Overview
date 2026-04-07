"use client";

import Image from "next/image";
import { LayoutDashboard, Box, Users, X, Home } from "lucide-react";

export default function Sidebar({
  activePage,
  setActivePage,
  mobileOpen,
  setMobileOpen,
}) {
  // 🔥 SCROLL FUNCTION (SUPER STABLE)
  const scrollToSection = (id, page) => {
    const target = document.getElementById(id);

    if (!target) {
      console.warn("Section tidak ditemukan:", id);
      return;
    }

    // 🔥 SCROLL KE SECTION (AMAN)
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setActivePage(page);
    setMobileOpen(false);
  };

  // 🔥 MENU STYLE
  const menuClass = (page) => {
    const base =
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200";

    if (activePage === page) {
      switch (page) {
        case "home":
          return `${base} bg-slate-200 text-slate-800 font-semibold`;

        case "mandays":
          return `${base} bg-blue-100 text-blue-700 font-semibold`;

        case "trainingplan":
          return `${base} bg-[#8CBD2D]/20 text-[#8CBD2D] font-semibold`;

        case "trainingcalendar":
          return `${base} bg-red-100 text-red-700 font-semibold`;

        default:
          return `${base} bg-gray-200`;
      }
    }

    return `${base} text-slate-600 hover:bg-slate-100 hover:scale-[1.02]`;
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-[90vw] max-w-[320px]
        bg-white shadow-2xl
        transform transition-transform duration-500 ease-in-out
        ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <Image
            src="/filtrona-logo-colorg.png"
            alt="Filtrona"
            width={120}
            height={60}
            priority
          />

          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={22} className="text-black" />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col px-4 py-6 gap-2">
          <button
            onClick={() => scrollToSection("home", "home")}
            className={menuClass("home")}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            onClick={() => scrollToSection("mandays", "mandays")}
            className={menuClass("mandays")}
          >
            <LayoutDashboard size={18} />
            <span>Mandays Training</span>
          </button>

          <button
            onClick={() => scrollToSection("training-plan", "trainingplan")}
            className={menuClass("trainingplan")}
          >
            <Box size={18} />
            <span>Training Plan</span>
          </button>

          <button
            onClick={() =>
              scrollToSection("training-calendar", "trainingcalendar")
            }
            className={menuClass("trainingcalendar")}
          >
            <Users size={18} />
            <span>Training Calendar</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
