"use client";

import "./globals.css";
import { useState } from "react";

import Sidebar from "./components/layout/sidebar";
import Header from "./components/layout/header";

export default function RootLayout({ children }) {
  // 🔥 SIDEBAR STATE
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // 🔥 DEFAULT PAGE = HOME
  const [activePage, setActivePage] = useState("home");

  // 🔥 HEADER ACTION
  const resetFilters = () => {
    console.log("reset filter");
  };

  const setEnter = (val) => {
    if (val === false) {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      setActivePage("home");
    }
  };

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* ✅ SIDEBAR (FIX layering) */}
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          {/* ✅ MAIN AREA */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* HEADER */}
            <Header
              collapsed={collapsed}
              setEnter={setEnter}
              resetFilters={resetFilters}
            />

            {/* MOBILE BUTTON */}
            <div className="md:hidden p-4 border-b bg-white">
              <button
                onClick={() => setMobileOpen(true)}
                className="px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition"
              >
                ☰
              </button>
            </div>

            {/* ✅ CONTENT (IMPORTANT FIX HERE) */}
            <main
              id="main-scroll"
              className="
                flex-1
                overflow-y-auto
                snap-y snap-mandatory
                scroll-smooth
              "
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
