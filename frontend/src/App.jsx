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
    <div className="container mt-4">
      <h2>Compliance Tracker</h2>

      <ClientList clients={clients} setSelectedClient={setSelectedClient} />

      {selectedClient && <TaskList client={selectedClient} />}
    </div>
  );
}

export default App;