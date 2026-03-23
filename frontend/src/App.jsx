import { useEffect, useState } from "react";
import { getClients } from "./api";
import ClientList from "./components/ClientList";
import TaskList from "./components/TaskList";

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  // ✅ create this function
  const loadClients = () => {
    getClients().then(res => setClients(res.data));
  };

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #eef2f7, #dde3ec)",
        minHeight: "100vh",
        padding: "40px"
      }}
    >
      <div className="container">

        <div className="mb-4">
          <h2 className="fw-bold" style={{ color: "#2c3e50" }}>
            Compliance Tracker
          </h2>
          <p style={{ color: "#6c757d" }}>
            Manage compliance tasks across clients
          </p>
        </div>

        <div
          className="shadow-sm p-4"
          style={{
            borderRadius: "14px",
            backgroundColor: "#ffffff",
            border: "1px solid #dce1e7"
          }}
        >
          {/* ✅ pass loadClients */}
          <ClientList
            clients={clients}
            setSelectedClient={setSelectedClient}
            loadClients={loadClients}
          />

          {selectedClient ? (
            <TaskList client={selectedClient} />
          ) : (
            <p className="text-muted mt-3">
              Select a client to view tasks
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;