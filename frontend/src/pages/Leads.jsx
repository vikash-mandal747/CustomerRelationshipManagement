import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { initSocket } from "../services/socket";

function LeadRow({ l }) {
  return (
    <tr className="bg-white even:bg-slate-50">
      <td className="p-3">{l.title}</td>
      <td className="p-3">{l.company}</td>
      <td className="p-3">{l.email}</td>
      <td className="p-3">{l.phone}</td>
      <td className="p-3"><span className="text-sm px-2 py-1 rounded bg-slate-100">{l.status}</span></td>
    </tr>
  );
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", email: "", phone: "", source: "" });
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchLeads();
    const s = initSocket();
    s.on("leadCreated", (lead) => {
      setLeads(prev => [lead, ...prev]);
    });
    s.on("leadUpdated", () => fetchLeads());
    return () => { s.off("leadCreated"); s.off("leadUpdated"); };
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await API.get("/leads");
      setLeads(res.data);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/leads", form);
      setShowCreate(false);
      setForm({ title: "", company: "", email: "", phone: "", source: "" });
    } catch (err) {
      alert(err?.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Leads</h2>
        <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-3 py-1 rounded">New Lead</button>
      </div>

      {showCreate && (
        <form onSubmit={submit} className="bg-white p-4 rounded mb-4 shadow grid grid-cols-1 md:grid-cols-2 gap-3">
          <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="p-2 border" />
          <input value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Company" className="p-2 border" />
          <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="p-2 border" />
          <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="p-2 border" />
          <input value={form.source} onChange={e=>setForm({...form,source:e.target.value})} placeholder="Source" className="p-2 border" />
          <div className="col-span-full flex gap-2 justify-end">
            <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
          </div>
        </form>
      )}

      <div className="bg-slate-100 p-4 rounded">
        <table className="w-full table-auto">
          <thead className="text-sm text-slate-600">
            <tr>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Company</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" className="p-3">Loading…</td></tr>
              : leads.length ? leads.map(l => <LeadRow key={l.id} l={l} />) 
              : <tr><td colSpan="5" className="p-3">No leads yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
