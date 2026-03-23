import { useState } from "react";
import { createClient } from "../api";

function ClientList({ clients, setSelectedClient, loadClients }) {
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("");

  const addClient = async () => {
    if (!company || !country || !type) return;

    await createClient({
      company_name: company,
      country,
      entity_type: type
    });

    setCompany("");
    setCountry("");
    setType("");
    loadClients();
  };

  return (
    <div className="mb-4 p-3 rounded"
      style={{ background: "#1e293b", border: "1px solid #334155" }}>

      <input className="form-control mb-2"
        placeholder="Company Name *"
        value={company}
        onChange={(e) => setCompany(e.target.value)} />

      <input className="form-control mb-2"
        placeholder="Country *"
        value={country}
        onChange={(e) => setCountry(e.target.value)} />

      <select className="form-control mb-2"
        value={type}
        onChange={(e) => setType(e.target.value)}>
        <option value="">Select Type *</option>
        <option>Private</option>
        <option>Public</option>
        <option>LLP</option>
      </select>

      <button className="btn btn-primary mb-3" onClick={addClient}>
        Add Client
      </button>

      <select className="form-select"
        onChange={(e) => setSelectedClient(e.target.value)}>
        <option>Select Client</option>
        {clients.map(c => (
          <option key={c._id} value={c._id}>
            {c.company_name}
          </option>
        ))}
      </select>

    </div>
  );
}

export default ClientList;