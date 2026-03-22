import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  company_name: String,
  country: String,
  entity_type: String
});

export default mongoose.model("Client", clientSchema);