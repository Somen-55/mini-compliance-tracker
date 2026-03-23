import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  editTask
} from "../api";

function TaskList({ client }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, [client]);

  const loadTasks = () => {
    getTasks(client).then(res => setTasks(res.data));
  };

  // ADD TASK
  const addTask = async () => {
    if (!title || !dueDate) {
      setError("⚠️ Title and Due Date are required");
      return;
    }

    setError("");

    await createTask({
      client_id: client,
      title,
      description,
      category,
      due_date: dueDate
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate("");
    loadTasks();
  };

  // UPDATE TASK
  const handleUpdate = async () => {
    await editTask(editingId, {
      title,
      description,
      category,
      due_date: dueDate
    });

    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setDueDate("");
    loadTasks();
  };

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue = tasks.filter(
    t => t.status === "Pending" && new Date(t.due_date) < new Date()
  ).length;

  return (
    <div className="d-flex flex-column gap-3">

      {/* SUMMARY */}
      <div className="p-3 rounded shadow-sm"
        style={{ backgroundColor: "#e9eef5", border: "1px solid #d6dde6" }}>
        <strong>Total:</strong> {total} |{" "}
        <strong>Pending:</strong> {pending} |{" "}
        <strong>Completed:</strong> {completed} |{" "}
        <strong style={{ color: "#dc3545" }}>Overdue:</strong> {overdue}
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      {/* INPUT */}
      <div className="p-3 rounded shadow-sm"
        style={{ backgroundColor: "#f9fbfd", border: "1px solid #e3e8ef" }}>

        <input
          className="form-control mb-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* DATE */}
        <input
          type="date"
          className="form-control mb-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="d-flex align-items-center">

          <button
            className="btn btn-primary me-2"
            onClick={addTask}
            disabled={!title || !dueDate || editingId}
          >
            Add Task
          </button>

          {editingId && (
            <>
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                Update Task
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setDescription("");
                  setCategory("");
                  setDueDate("");
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* EDIT MODE INFO */}
        {editingId && (
          <div className="alert alert-info mt-2 py-1">
            ✏️ Editing mode active. Update or cancel before adding new task.
          </div>
        )}
      </div>

      {/* FILTER */}
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="fw-semibold mb-0">Tasks</h5>

        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Overdue</option>
        </select>
      </div>

      {/* TASK GRID */}
      <div className="row">
        {[...tasks]
          .filter(task => {
            if (filter === "Pending") return task.status === "Pending";
            if (filter === "Completed") return task.status === "Completed";
            if (filter === "Overdue") {
              return task.status === "Pending" &&
                new Date(task.due_date) < new Date();
            }
            return true;
          })
          .sort((a, b) => {
            const aOverdue =
              a.status === "Pending" &&
              new Date(a.due_date) < new Date();
            const bOverdue =
              b.status === "Pending" &&
              new Date(b.due_date) < new Date();
            return bOverdue - aOverdue;
          })
          .map(task => {
            const isOverdue =
              task.status === "Pending" &&
              new Date(task.due_date) < new Date();

            return (
              <div className="col-md-4" key={task._id}>
                <div
                  className="card p-3 mb-3 shadow-sm h-100"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid #e3e8ef",
                    borderLeft: isOverdue
                      ? "4px solid #dc3545"
                      : task.status === "Completed"
                      ? "4px solid #198754"
                      : "4px solid #ffc107"
                  }}
                >
                  <h5>{task.title}</h5>

                  <p className="text-muted small">
                    {task.description || "No description"}
                  </p>

                  <p className="small">
                    <strong>Category:</strong> {task.category || "General"}
                  </p>

                  <p className="small">
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        task.status === "Completed"
                          ? "text-success"
                          : "text-warning"
                      }
                    >
                      {task.status}
                    </span>
                  </p>

                  {isOverdue && (
                    <span className="badge bg-danger mb-2">Overdue</span>
                  )}

                  <button
                    className={`btn btn-sm mb-2 ${
                      task.status === "Completed"
                        ? "btn-outline-secondary"
                        : "btn-outline-success"
                    }`}
                    onClick={() =>
                      updateTask(task._id).then(loadTasks)
                    }
                  >
                    {task.status === "Completed"
                      ? "Mark Pending"
                      : "Mark Completed"}
                  </button>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => {
                        setTitle(task.title);
                        setDescription(task.description);
                        setCategory(task.category);
                        setDueDate(task.due_date.split("T")[0]);
                        setEditingId(task._id);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        deleteTask(task._id).then(loadTasks)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-muted mt-4">
          <h6>No tasks found</h6>
        </div>
      )}
    </div>
  );
}

export default TaskList;