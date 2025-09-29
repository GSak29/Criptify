import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  website: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true }, // optionally encrypt this
  category: { type: String, default: "personal" },
  description: { type: String },
  strength: { type: String },
}, { timestamps: true });

export default mongoose.model("Password", passwordSchema);
