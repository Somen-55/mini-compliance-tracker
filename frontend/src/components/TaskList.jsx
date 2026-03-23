import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  editTask
} from "../api";

// Define your professional categories here
const PRESET_CATEGORIES = ["GST", "Tax", "Legal", "Audit", "Payroll", "Admin", "Client Meet"];

function TaskList({ client }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(PRESET_CATEGORIES[0]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, [client]);

  const loadTasks = () => {
    if (client) {
      getTasks(client).then((res) => setTasks(res.data));
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !dueDate) {
      setError("⚠️ All fields are required");
      return;
    }
    setError("");

    const taskData = {
      client_id: client,
      title,
      description,
      category,
      due_date: dueDate,
      priority
    };

    if (!editingId) {
      await createTask(taskData);
    } else {
      await editTask(editingId, taskData);
    }

    resetForm();
    loadTasks();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(PRESET_CATEGORIES[0]);
    setDueDate("");
    setPriority("Medium");
    setEditingId(null);
  };

  const getFilteredTasks = () => {
    return tasks
      .filter((task) => {
        const matchesFilter = 
          filter === "All" || 
          (filter === "Pending" && task.status === "Pending") ||
          (filter === "Completed" && task.status === "Completed") ||
          (filter === "Overdue" && task.status === "Pending" && new Date(task.due_date) < new Date());
        
        const matchesSearch = 
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          task.category.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  };

  const completionRate = tasks.length 
    ? Math.round((tasks.filter(t => t.status === "Completed").length / tasks.length) * 100) 
    : 0;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "20px" }}>
      <div className="container-fluid" style={{ maxWidth: "1250px" }}>
        
        {/* HEADER SECTION */}
        <div className="row mb-4 align-items-center bg-white p-3 rounded-4 shadow-sm mx-0">
          <div className="col-md-4">
            <h4 className="fw-bold text-dark mb-0">Compliance Tracker</h4>
            <span className="text-muted small">Client Workspace</span>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <div className="progress flex-grow-1" style={{ height: "8px" }}>
                <div className="progress-bar bg-primary" style={{ width: `${completionRate}%`, borderRadius: "10px" }}></div>
              </div>
              <span className="small fw-bold text-primary">{completionRate}% Done</span>
            </div>
          </div>
          <div className="col-md-4 d-flex justify-content-end gap-2">
            <StatPill label="Pending" count={tasks.filter(t => t.status === "Pending").length} color="#f59e0b" />
            <StatPill label="Overdue" count={tasks.filter(t => t.status === "Pending" && new Date(t.due_date) < new Date()).length} color="#ef4444" />
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT: FORM SIDEBAR */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: "20px", top: "20px" }}>
              <h5 className="fw-bold mb-4">{editingId ? "Edit Compliance Task" : "New Compliance Task"}</h5>
              
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Task Title</label>
                <input className="form-control border-0 bg-light py-2 shadow-none" placeholder="e.g. Monthly Filing" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Task Category</label>
                <div className="d-flex flex-wrap gap-2">
                  {PRESET_CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 ${category === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                      style={{ fontSize: '12px' }}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Priority</label>
                  <select className="form-select border-0 bg-light shadow-none" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Due Date</label>
                  <input type="date" className="form-control border-0 bg-light shadow-none" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Description</label>
                <textarea className="form-control border-0 bg-light shadow-none" rows="2" placeholder="Notes..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button className="btn btn-primary w-100 fw-bold py-2 mb-2 shadow-sm" onClick={handleSubmit}>
                {editingId ? "Update Record" : "Add to List"}
              </button>
              {editingId && <button className="btn btn-link w-100 text-secondary small" onClick={resetForm}>Cancel Edit</button>}
            </div>
          </div>

          {/* RIGHT: SEARCHABLE LIST */}
          <div className="col-lg-8">
            <div className="row g-2 mb-3 align-items-center">
              <div className="col-md-7">
                <input 
                  type="text" 
                  className="form-control border-0 shadow-sm py-2 px-3 rounded-3" 
                  placeholder="Search by title or category (e.g. 'GST')..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-5 d-flex gap-2">
                <select className="form-select border-0 shadow-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option>All</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>

            {/* SCROLLABLE TASK FEED */}
            <div className="pe-2" style={{ height: "calc(100vh - 230px)", overflowY: "auto" }}>
              <div className="row g-3">
                {getFilteredTasks().map((task) => (
                  <TaskItem 
                    key={task._id} 
                    task={task} 
                    onEdit={() => {
                      setTitle(task.title);
                      setDescription(task.description);
                      setCategory(task.category);
                      setDueDate(task.due_date.split("T")[0]);
                      setPriority(task.priority);
                      setEditingId(task._id);
                    }}
                    onUpdate={() => updateTask(task._id).then(loadTasks)}
                    onDelete={() => deleteTask(task._id).then(loadTasks)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .task-row:hover { transform: scale(1.01); transition: 0.2s ease-in-out; }
      `}</style>
    </div>
  );
}

/* SUB-COMPONENTS */

function StatPill({ label, count, color }) {
  return (
    <div className="bg-light border px-3 py-1 rounded-pill text-center" style={{ minWidth: '100px' }}>
      <div className="fw-bold" style={{ color, fontSize: '14px' }}>{count}</div>
      <div className="text-secondary fw-bold" style={{ fontSize: '9px', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function TaskItem({ task, onEdit, onUpdate, onDelete }) {
  const isOverdue = task.status === "Pending" && new Date(task.due_date) < new Date();
  const priorityColor = task.priority === "High" ? "#ef4444" : task.priority === "Medium" ? "#f59e0b" : "#10b981";

  return (
    <div className="col-12 task-row">
      <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "16px", borderLeft: `6px solid ${isOverdue ? '#ef4444' : (task.status === 'Completed' ? '#10b981' : '#6366f1')}` }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge" style={{ backgroundColor: `${priorityColor}15`, color: priorityColor, fontSize: '10px' }}>{task.priority}</span>
              <span className="fw-bold text-primary px-2 py-0 bg-primary bg-opacity-10 rounded" style={{ fontSize: '11px' }}>{task.category}</span>
            </div>
            <h6 className={`fw-bold mb-0 ${task.status === "Completed" ? "text-decoration-line-through text-muted" : ""}`}>
              {task.title}
            </h6>
            <div className="d-flex gap-3 mt-2 text-secondary" style={{ fontSize: '12px' }}>
              <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
              {isOverdue && <span className="text-danger fw-bold">OVERDUE</span>}
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <button className={`btn btn-sm fw-bold rounded-3 ${task.status === "Completed" ? 'btn-light' : 'btn-primary'}`} onClick={onUpdate}>
              {task.status === "Completed" ? "Undo" : "Close"}
            </button>
            <div className="btn-group">
              <button className="btn btn-sm btn-outline-light text-secondary border-0" onClick={onEdit}>Edit</button>
              <button className="btn btn-sm btn-outline-light text-danger border-0" onClick={onDelete}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;