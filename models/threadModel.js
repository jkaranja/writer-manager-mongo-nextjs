//checked
//starred
//topic etc
const mongoose = require("mongoose");
//to accept anything leave {} or '' or {type: Mixed}
const orderSchema = mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
    cWriter: { type: String, default: "" },
    wClient: { type: String, default: "writer" },
    message: { type: String, default: "" },   
    threadFiles: { type: [], default: [] },
    read: { type: Boolean, default: false },
    writerComment: { type: String, default: "" },    
    isChecked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// orderStatus/unclaimed
// pool > active//danger
// writer> unconfirmed  //special re//danger
//pending > pending//danger
//

module.exports = mongoose.model("Order", orderSchema);
