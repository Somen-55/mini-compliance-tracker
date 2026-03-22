import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask } from "../api";

function TaskList({ client }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadTasks();
  }, [client]);

  const loadTasks = () => {
    getTasks(client).then(res => setTasks(res.data));
  };

  const addTask = async () => {
    await createTask({
      client_id: client,
      title,
      due_date: new Date()
    });
    setTitle("");
    loadTasks();
  };

  const markDone = async (id) => {
    await updateTask(id);
    loadTasks();
  };

  return (
    <div>
      <input
        className="form-control mb-2"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn btn-primary mb-3" onClick={addTask}>
        Add Task
      </button>

      {tasks.map(task => {
        const isOverdue =
          task.status === "Pending" &&
          new Date(task.due_date) < new Date();

        return (
          <div
            key={task._id}
            className={`card p-2 mb-2 ${
              isOverdue ? "border-danger" : ""
            }`}
          >
            <h5>{task.title}</h5>
            <p>Status: {task.status}</p>

            {isOverdue && (
              <span className="text-danger">⚠️ Overdue</span>
            )}

            {task.status === "Pending" && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => markDone(task._id)}
              >
                Mark Completed
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;