import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App(){
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} />
      <div className="flex">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><Leads/></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
