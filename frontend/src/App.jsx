import { useEffect, useState } from "react";
import { getClients } from "./api";
import ClientList from "./components/ClientList";
import TaskList from "./components/TaskList";

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    getClients().then(res => setClients(res.data));
  }, []);

  return (
    <div className="container mt-5">
      
      {/* 🔥 HEADER */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Compliance Tracker</h2>
        <p className="text-muted">
          Manage client compliance tasks efficiently
        </p>
      </div>

      {/* 🔹 MAIN CARD */}
      <div className="card shadow p-4">
        
        <ClientList
          clients={clients}
          setSelectedClient={setSelectedClient}
        />

        {selectedClient ? (
          <TaskList client={selectedClient} />
        ) : (
          <p className="text-center text-muted mt-3">
            Please select a client to view tasks
          </p>
        )}

      </div>
    </div>
  );
}

export default App;