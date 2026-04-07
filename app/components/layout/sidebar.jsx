"use client";

import React from "react";
import {
  HomeIcon,
  LayoutDashboardIcon,
  ClipboardListIcon,
  CalendarIcon,
  XIcon,
} from "lucide-react";

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  activePage,
  setActivePage,
}) {
  const menuItems = [
    { id: "home", label: "Home", icon: <HomeIcon size={20} /> },
    {
      id: "mandays",
      label: "Mandays Training",
      icon: <LayoutDashboardIcon size={20} />,
    },
    {
      id: "training-plan",
      label: "Training Plan",
      icon: <ClipboardListIcon size={20} />,
    },
    {
      id: "training-calendar",
      label: "Training Calendar",
      icon: <CalendarIcon size={20} />,
    },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileOpen(false);

    // Scroll ke section
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* OVERLAY: Harus di atas Header (Header biasanya z-9999, jadi kita pakai z-[10000]) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[10000] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER: z-[10001] agar di atas overlay dan header */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-[10001] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER SIDEBAR (LOGO & CLOSE BUTTON) */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex flex-col gap-1">
            {/* 🔥 LOGO FILTRONA */}
            <img
              src="/filtrona-logo-colorg.png"
              alt="Filtrona"
              className="h-7 object-contain w-auto mb-1"
              onError={(e) => {
                e.target.src =
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_p_G5_JpQ2ZfE9J9m9P9P9P9P9P9P9P9P9A&s";
              }} // Fallback jika logo tidak ketemu
            />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* MENU LIST */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <div
                  className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-sm font-bold ${isActive ? "opacity-100" : "opacity-90"}`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-50 bg-slate-50 shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[3px] text-center">
            FILTRONA © 2026
          </p>
        </div>
      </div>
    </>
  );
}
