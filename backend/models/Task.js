import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  title: String,
  description: String,
  category: String,
  due_date: Date,
  status: {
    type: String,
    default: "Pending"
  },
  priority: String
});

export default mongoose.model("Task", taskSchema);