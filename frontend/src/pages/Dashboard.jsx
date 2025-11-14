import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import API from "../api/axiosInstance";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, contacted: 0 });
  const [trend, setTrend] = useState({ labels: [], data: [] });
  const [sourceData, setSourceData] = useState({labels: [], values: []});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/leads"); // returns leads list
        const leads = res.data;
        setStats({
          totalLeads: leads.length,
          newLeads: leads.filter(l => l.status === 'new').length,
          contacted: leads.filter(l => l.status && l.status.toLowerCase().includes('contact')).length
        });

        // simple sample trend - count per day (stubbed)
        const labels = leads.slice(0, 7).map(l => new Date(l.createdAt).toLocaleDateString());
        const data = leads.slice(0, 7).map(() => Math.floor(Math.random() * 5) + 1);
        setTrend({ labels, data });

        // source breakdown
        const sourceMap = {};
        leads.forEach(l => { const k = l.source || "Unknown"; sourceMap[k] = (sourceMap[k] || 0) + 1; });
        setSourceData({ labels: Object.keys(sourceMap), values: Object.values(sourceMap) });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Leads" value={stats.totalLeads} />
        <StatCard title="New Leads (this week)" value={stats.newLeads} />
        <StatCard title="Contacted" value={stats.contacted} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Lead Trend (last 7)</h3>
          <Line data={{
            labels: trend.labels,
            datasets: [{ label: 'Leads', data: trend.data, fill: true, tension: 0.3 }]
          }} />
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Source Breakdown</h3>
          <Doughnut data={{
            labels: sourceData.labels,
            datasets: [{ data: sourceData.values }]
          }} />
        </div>
      </div>
    </div>
  );
}
