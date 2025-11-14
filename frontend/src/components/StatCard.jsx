import React from "react";

export default function StatCard({ title, value, delta }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 flex items-baseline gap-3">
        <div className="text-2xl font-semibold">{value}</div>
        {delta !== undefined && <div className="text-sm text-green-600">{delta}</div>}
      </div>
    </div>
  );
}
