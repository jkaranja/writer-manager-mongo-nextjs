// //update

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const sendEmail = require("../helpers/emailSender");
// const crypto = require("crypto");
// const axios = require("axios");
// //8 models
// const clientAccountModel = require("../models/clientAccountModel");
// const writerAccountModel = require("../models/writerAccountModel");
// const smsSubModel = require("../models/smsSubModel");
// const orderModel = require("../models/orderModel");
// const clientFundModel = require("../models/clientFundModel");
// const clientSubModel = require("../models/clientSubModel");
// const chatModel = require("../models/chatModel");
// const clientReportModel = require("../models/clientReportModel");
// const kopoModel = require("../models/kopoModel");



// //update client profile
// const updateClientProfile = async (req, res, next) => {
//   const { _id, email } = req.user;
//   //destructure req.bdy
//   const { newEmail, username, currentPassword, newPassword, phoneNumber } =
//     req.body;

//   try {
//     //check all field not empty
//     if (
//       !newEmail ||
//       !username ||
//       !currentPassword ||
//       !newPassword ||
//       !phoneNumber
//     ) {
//       throw new Error("Please fill all fields");
//     }

//     //id is coming from protected/fetched from db/so valid/
//     //first authenticate user again// password match//added security//confirm password
//     const userInfo = await clientAccountModel.findById(_id);

//     const checking = await bcrypt.compare(currentPassword, userInfo.password);
//     if (!checking) {
//       throw new Error("Failed! Wrong current password! Please check again.");
//     }

//     //check if email=newEmail//update other details
//     if (newEmail === email) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(newPassword, salt);

//       const update = await clientAccountModel.findByIdAndUpdate(
//         _id,
//         { $set: { username, password: hashedPassword, phoneNumber } },
//         { new: true }
//       );
//       if (!update) {
//         throw new Error("Something went wrong! Please try again.");
//       }

//       //send success//return to stop execution after response//throw err also stops s well
//       //res.json only terminate response not execution
//       return res.status(200).json({
//         _id: update._id,
//         _userType: "client",
//         email: update.email,
//         username: update.username,
//         phoneNumber: update.phoneNumber,
//         token: genToken(update._id),
//       });
//     }

//     //emails not same//i.e is new/should be unique

//     //1.check if email is taken by writer in writer table
//     const writerExists = await writerAccountModel.findOne({ email: newEmail });
//     if (writerExists) {
//       throw new Error("Email already exists! Please try a different one.");
//     }
//     //2.check if client exists in client table
//     const clientExists = await clientAccountModel.findOne({ email: newEmail });
//     if (clientExists) {
//       throw new Error("Email already exists! Please try a different one.");
//     }

//     //now unique update all details//then other tables where wClient is
//     //hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);

//     //update client table//use setTimeout to display logout message then logout/kill localStorage
//     const updated = await clientAccountModel.findByIdAndUpdate(
//       _id,
//       {
//         $set: {
//           username,
//           password: hashedPassword,
//           phoneNumber,
//           email: newEmail,
//         },
//       },
//       { new: true }
//     );
//     if (!updated) {
//       throw new Error("Something went wrong! Please try again.");
//     }

//     //update the rest of the tables
//     //funds table//update phoneNumber too
//     const funds = await clientFundModel.updateOne(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     //orders table
//     const inOrders = await orderModel.updateMany(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     //clientSub
//     const clientSub = await clientSubModel.updateOne(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     //sms Sub
//     const smsSub = await smsSubModel.updateOne(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );

//     //writers table
//     const userWriters = await writerAccountModel.updateMany(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     //chat table
//     const chat = await chatModel.updateMany(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     const updateSender = await chatModel.updateMany(
//       { sender: email },
//       { $set: { sender: newEmail } }
//     );
//     //report
//     const clientReport = await clientReportModel.updateMany(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     //update k2
//     const updateKopo = await kopoModel.updateMany(
//       { wClient: email },
//       { $set: { wClient: newEmail } }
//     );
//     //if any above fails, contact support
//     // if(!funds.modifiedCount || !inOrders.modifiedCount || !clientSub.modifiedCount || !smsSub.modifiedCount || !userWriters.modifiedCount || !chat.modifiedCount){
//     //   throw new Error('Oops! Some records were not updated. Please contact support.')
//     // }

//     //send success

//     res.status(200).json({
//       _id: updated._id,
//       _userType: "client",
//       email: updated.email,
//       username: updated.username,
//       phoneNumber: updated.phoneNumber,
//       token: genToken(updated._id),
//     });
//   } catch (error) {
//     res.status(400);
//     next(error);
//   }
// };

// //gen token
// const genToken = (id) => {
//   //don't expire/remove expr
//   //return  jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '3d'})
//   return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// module.exports = {
//   registerClient,
//   confirmClient,
//   updateClientProfile,
// };
