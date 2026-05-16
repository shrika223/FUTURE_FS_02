import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [leads, setLeads] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    source: "",
    status: "New"
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch("http://localhost:5000/api/leads");
    const data = await res.json();
    setLeads(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`http://localhost:5000/api/leads/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      setEditingId(null);
    } else {
      await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
    }

    setForm({
      name: "",
      email: "",
      source: "",
      status: "New"
    });

    fetchLeads();
  };

  const deleteLead = async (id) => {
    await fetch(`http://localhost:5000/api/leads/${id}`, {
      method: "DELETE"
    });

    fetchLeads();
  };

  const editLead = (lead) => {
    setForm(lead);
    setEditingId(lead.id);
  };

  const totalLeads = leads.length;

  const contacted = leads.filter(
    (lead) => lead.status === "Contacted"
  ).length;

  const converted = leads.filter(
    (lead) => lead.status === "Converted"
  ).length;

  return (
    <div className="container">
      <h1>✨ Mini CRM Dashboard</h1>

      <div className="dashboard">
        <div className="dash-card">
          <h2>{totalLeads}</h2>
          <p>Total Leads</p>
        </div>

        <div className="dash-card">
          <h2>{contacted}</h2>
          <p>Contacted</p>
        </div>

        <div className="dash-card">
          <h2>{converted}</h2>
          <p>Converted</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Client Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Client Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Lead Source"
          value={form.source}
          onChange={(e) =>
            setForm({ ...form, source: e.target.value })
          }
          required
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Converted</option>
        </select>

        <button type="submit">
          {editingId ? "Update Lead" : "Add Lead"}
        </button>
      </form>

      <div className="lead-list">
        {leads.map((lead) => (
          <div className="card" key={lead.id}>
            <h3>{lead.name}</h3>

            <p>{lead.email}</p>

            <p>
              <strong>Source:</strong> {lead.source}
            </p>

            <span className={`status ${lead.status}`}>
              {lead.status}
            </span>

            <div className="btn-group">
              <button onClick={() => editLead(lead)}>
                Edit
              </button>

              <button onClick={() => deleteLead(lead.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;