//checked
//starred
//topic etc
import mongoose from "mongoose";
//to accept anything leave {} or '' or {type: Mixed}
const taskSchema = mongoose.Schema(
  {
    wClient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Client",
    },
    cWriter: { type: mongoose.Schema.Types.ObjectId, ref: "Writer" },
    title: { type: String, default: "" },
    deadline: Date,
    instructions: { type: String, default: "" },
    instructionFiles: { type: [], default: [] },
    taskFiles: { type: [], default: [] },
    budget: { type: Number, default: 0 },
    taskStatus: { type: String, default: "Ongoing" },
    invoiceAmount: { type: Number, default: 0 },
    partialAmount: { type: Number, default: 0 },
    payStatus: { type: String, default: "pending" },
    isChecked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// orderStatus/unclaimed
// pool > active//danger
// writer> unconfirmed  //special re//danger
//pending > pending//danger
//

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
