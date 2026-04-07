"use client";

export default function Header({ setMobileOpen, activePage, resetFilters }) {
  // Patokan utama: Apakah activePage adalah "home"?
  const isHome = activePage === "home";

  return (
    <header
      // 🔥 Pastikan menggunakan z-[9999] agar selalu di atas
      className={`fixed top-0 w-full text-white h-14 flex items-center justify-between px-4 lg:px-6 z-[9999] transition-all duration-300 ${
        isHome ? "bg-transparent shadow-none" : "bg-[#1e3a8a] shadow-md"
      }`}
    >
      {/* KIRI: Logo Filtrona */}
      <div className="flex items-center">
        <img
          src="/filtrona-logo-white.png"
          alt="Filtrona"
          className="h-6 object-contain"
        />
      </div>

      {/* KANAN: Reset Filter Icon & Hamburger Menu */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Tombol Reset Filter HANYA muncul jika BUKAN di home */}
        {!isHome && (
          <button
            onClick={resetFilters}
            title="Reset Filters"
            className="text-white hover:text-gray-200 transition p-2 rounded-full hover:bg-white/20 active:scale-95 cursor-pointer flex items-center justify-center bg-transparent border-none outline-none"
          >
            <svg
              className="w-5 h-5 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}

        {/* Tombol Hamburger Sidebar */}
        <button
          onClick={() => setMobileOpen(true)}
          title="Menu"
          className="text-white hover:text-gray-200 focus:outline-none transition cursor-pointer p-2 rounded-full hover:bg-white/20 bg-transparent border-none outline-none"
        >
          <svg
            className="w-6 h-6 md:w-7 md:h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
