import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    responsibilities: [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
