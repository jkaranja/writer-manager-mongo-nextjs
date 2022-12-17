//checked
//starred
//topic etc
import  mongoose from "mongoose";
//to accept anything leave {} or '' or {type: Mixed}
const threadSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task",
    },    
    threadMessage: { type: String, default: "" },   
    threadFiles: { type: [], default: [] },
    read: { type: Boolean, default: false },
    sender: { type: String, default: "" },    
    isChecked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// orderStatus/unclaimed
// pool > active//danger
// writer> unconfirmed  //special re//danger
//pending > pending//danger
//

export default mongoose.models.Thread || mongoose.model("Thread", threadSchema);
