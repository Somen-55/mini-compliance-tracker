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
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [client]);

  const loadTasks = () => {
    getTasks(client).then(res => setTasks(res.data));
  };

  const addTask = async () => {
    if (!title) return;

    await createTask({
      client_id: client,
      title,
      description,
      category,
      due_date: new Date()
    });

    setTitle("");
    setDescription("");
    setCategory("");
    loadTasks();
  };

  const handleUpdate = async () => {
    await editTask(editingId, { title, description, category });
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    loadTasks();
  };

  // Summary
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue = tasks.filter(
    t =>
      t.status === "Pending" &&
      new Date(t.due_date) < new Date()
  ).length;

  return (
    <div>
      {/* SUMMARY */}
      <div className="mb-3 p-2 bg-light rounded">
        Total: {total} | Pending: {pending} | Completed: {completed} |{" "}
        <span className="text-danger">Overdue: {overdue}</span>
      </div>

      {/* INPUT */}
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

      <button className="btn btn-primary mb-2" onClick={addTask}>
        Add Task
      </button>

      {editingId && (
        <button className="btn btn-success mb-3 ms-2" onClick={handleUpdate}>
          Update Task
        </button>
      )}

      {/* GRID */}
      <div className="row">
        {[...tasks]
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
                  className={`card p-3 mb-3 shadow-sm ${
                    isOverdue ? "border-danger" : ""
                  }`}
                >
                  <h5>{task.title}</h5>
                  <p>{task.description}</p>
                  <p><strong>Category:</strong> {task.category}</p>
                  <p>
                    Status:{" "}
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
                    <span className="badge bg-danger mb-2">
                      🔴 Overdue
                    </span>
                  )}

                  {task.status === "Pending" && (
                    <button
                      className="btn btn-sm btn-success mb-2"
                      onClick={() => updateTask(task._id).then(loadTasks)}
                    >
                      Mark Completed
                    </button>
                  )}

                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => {
                      setTitle(task.title);
                      setDescription(task.description);
                      setCategory(task.category);
                      setEditingId(task._id);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTask(task._id).then(loadTasks)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TaskList;