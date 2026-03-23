import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  entity_type: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Client", clientSchema);