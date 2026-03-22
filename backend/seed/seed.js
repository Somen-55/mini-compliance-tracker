import mongoose from "mongoose";
import dotenv from "dotenv";
import Client from "../models/Client.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Client.deleteMany();

await Client.insertMany([
  {
    company_name: "ABC Pvt Ltd",
    country: "India",
    entity_type: "Private Limited"
  },
  {
    company_name: "XYZ Ltd",
    country: "USA",
    entity_type: "Corporation"
  }
]);

console.log("Clients added");
process.exit();