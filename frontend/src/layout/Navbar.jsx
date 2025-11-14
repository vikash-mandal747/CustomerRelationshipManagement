import React from "react";

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-slate-100"
          aria-label="toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-lg font-semibold">NextGen CRM</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm text-slate-600">Your startup CRM</div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
            </svg>
          </button>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded">
            <img src="/avatar-placeholder.png" alt="me" className="w-7 h-7 rounded-full" />
            <div className="text-sm">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
