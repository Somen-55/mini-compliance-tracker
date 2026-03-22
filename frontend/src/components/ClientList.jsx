function ClientList({ clients, setSelectedClient }) {
  return (
    <select
      className="form-control mb-3"
      onChange={(e) => setSelectedClient(e.target.value)}
    >
      <option>Select Client</option>
      {clients.map(c => (
        <option key={c._id} value={c._id}>
          {c.company_name}
        </option>
      ))}
    </select>
  );
}

export default ClientList;