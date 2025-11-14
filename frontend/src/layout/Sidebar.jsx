import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ collapsed }) {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded hover:bg-slate-100 ${isActive ? 'bg-slate-100 font-semibold' : 'text-slate-700'}`;

  return (
    <aside className={`bg-white border-r w-64 ${collapsed ? 'hidden md:block' : 'block'} min-h-screen`}>
      <div className="p-4 text-lg font-semibold">CRM</div>
      <nav className="flex flex-col gap-1 p-2">
        <NavLink to="/dashboard" className={linkClass}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M3 3h18v10H3z" /></svg>
          Dashboard
        </NavLink>
        <NavLink to="/leads" className={linkClass}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 2l3 7h7l-5.5 4 2 7L12 16 5.5 20 7.5 13 2 9h7z"/></svg>
          Leads
        </NavLink>
        <NavLink to="/activities" className={linkClass}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M8 7V3M16 7V3M12 11v10"/></svg>
          Activities
        </NavLink>
        <NavLink to="/analytics" className={linkClass}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" d="M3 3v18h18"/></svg>
          Analytics
        </NavLink>
      </nav>
    </aside>
  );
}
