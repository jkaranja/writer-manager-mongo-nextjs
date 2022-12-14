import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //to accept anything leave {} or '' or {type: Object}
    username: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String, default: "+2547********" },
    confirmKey: { type: String },
    emailStatus: { type: String, default: "unconfirmed" },
    isChecked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//prevent nextjs from creating the model over and over//check if it has been created
 export default mongoose.models.Client || mongoose.model("Client", userSchema);
