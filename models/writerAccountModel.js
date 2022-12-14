import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    wClient: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    accountStatus: { type: String, default: "approved" },
    isChecked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Writer || mongoose.model("Writer", userSchema);
