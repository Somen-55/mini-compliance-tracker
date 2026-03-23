import { useState } from "react";
import { createClient } from "../api";

function ClientList({ clients, setSelectedClient }) {
  const [name, setName] = useState("");

  const addClient = async () => {
    if (!name) return;

    await createClient({
      company_name: name,
      country: "India",
      entity_type: "Private Limited"
    });

    window.location.reload();
  };

  return (
    <div className="mb-4">
      <div className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Add new client"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addClient}>
          Add Client
        </button>
      </div>

      <label className="form-label fw-bold">Select Client</label>

      <select
        className="form-select"
        defaultValue=""
        onChange={(e) => setSelectedClient(e.target.value)}
      >
        <option value="" disabled>
          -- Choose a Client --
        </option>

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