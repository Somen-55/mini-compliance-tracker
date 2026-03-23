import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending"
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium"
  }
}, {
  timestamps: true
});

export default mongoose.model("Task", taskSchema);