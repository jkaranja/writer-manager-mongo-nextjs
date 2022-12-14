import connectDB from "../../../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../../utils/emailSender";
import crypto from "crypto";
import writerAccountModel from "../../../../models/writerAccountModel";
import clientAccountModel from "../../../../models/clientAccountModel";
import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";
import { protectedClient } from "../../../../middleware/authMiddleware";

import nc from "next-connect";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

//client register writer
handler

  .use(protectedClient)
  .post(async (req, res, next) => {
    //get client from protected middleware
    const { id } = req.user;
    const wClient = req.user.email

    //destructure req.bdy
    const { username, email, phoneNumber } = req.body;

    try {
      //connection
      await connectDB();
      //check if all these are not empty
      if (!username || !email || !phoneNumber) {
        throw new Error("All fields required");
      }

      //must not be other writer assigned this username by this client
      const writerX = await writerAccountModel.findOne({
        wClient: id,
        username,
      });
      if (writerX) {
        throw new Error(
          "Failed! You have another writer with the same username. Try another one."
        );
      }

      //1.check if email exists in writer table
      const writerExists = await writerAccountModel.findOne({ email });
      if (writerExists) {
        throw new Error("Email already exists! Please try a different one.");
      }
      //2.check if email exists in client table
      const clientExists = await clientAccountModel.findOne({ email });
      if (clientExists) {
        throw new Error("Email already exists! Please try a different one.");
      }

      //3.email doesn't exist in both tables//proceed to register writer in writer table
      ///gen random password password//4=8 character pass
      const password = crypto.randomBytes(4).toString("hex");
      //hash the password for storing in db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //.4. //register writer//returns inserted doc/record
      const user = await writerAccountModel.create({
        wClient:id,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
      });
      //6. sending email
      //include a client url with a page with key/id query string/
      //Send email using nodemailer
      const emailInfo = {
        subject: "Your writer account login details",
        to: email,
        body: `
            <p>Your client, ${wClient}, has added you as their writer on clientlance.io</p>
            <p>Please use these details to log in to your account:</p>
            <p style="font-weight: bold;">Email: ${email}</p>
            <p style="font-weight: bold;">Password: ${password}</p>  
            <p style="font-style: italic;">Note: Be sure to change your password after you log in.</p>       
            `,
      };
      sendEmail(emailInfo);

      res.status(201).json(user);
    } catch (error) {      
      next(error);
    }
  })

  //get all writers
  .get(async (req, res, next) => {
    //get wClient from token//email/client table
    //altho doc returned has _id property,  _id = id/string version of _id/ObjectId //but document returned has _id
    const { email, id } = req.user;

    try {
      //connection
      await connectDB();
      //NOTE: if none found, FIND RETURNS []=TRUthy//findOne RETURNS NULL//FALSy
      const writers = await writerAccountModel
        .find({ wClient: id })
        .sort({ updatedAt: -1 });
      //unlike findOne, use emptyArray.length =0//falsy  with find
      if (!writers.length) {
        throw new Error("No record found.");
      }

      res.status(200).json(writers);
    } catch (error) {      
      next(error);
    }
  })

  //update writer profile//also status as well////suspend writer
  .put(async (req, res, next) => {
    //get wClient from token//email/client table
    const { email } = req.user;

    //get writer id /and current email//from fetched//use local storage
    //destructure req.bdy
    const {
      newEmail,
      currEmail,
      id,
      username,
      currUsername,
      phoneNumber,
      accountStatus,
    } = req.body;

    try {
      //connection
      await connectDB();
      //check all field not empty
      if (
        !newEmail ||
        !id ||
        !currEmail ||
        !currUsername ||
        !username ||
        !accountStatus ||
        !phoneNumber
      ) {
        throw new Error("Please fill all fields");
      }

      //check if id is valid ObjectId//ObjectIds is constructed only from 24 hex character strings
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("Failed! Invalid writer id. Please contact support");
      }

      //username changed
      //must not be other writer assigned this username by this client
      if (currUsername !== username) {
        const writer = await writerAccountModel.findOne({
          wClient: email,
          username,
        });
        if (writer) {
          throw new Error(
            "Failed! You have another writer with the same username. Try another one."
          );
        }
      }

      //check if email=newEmail//update other details
      if (newEmail === currEmail) {
        const updatedWriter = await writerAccountModel.findByIdAndUpdate(
          id,
          { $set: { username, phoneNumber, accountStatus } },
          { new: true }
        );
        if (!updatedWriter) {
          throw new Error("Failed! Wrong writer id. Please contact support");
        }

        //in case username has changed//update in chat and orders
        const inOrders = await orderModel.updateMany(
          { cWriter: currEmail },
          { $set: { cUsername: username } }
        );
        //chat table
        const chat = await chatModel.updateMany(
          { cWriter: currEmail },
          { $set: { cUsername: username } }
        );

        //send success
        return res.status(200).json(updatedWriter);
      }

      //emails not same//i.e is new/should be unique

      //1.check if email is taken by writer in writer table
      const writerExists = await writerAccountModel.findOne({
        email: newEmail,
      });
      if (writerExists) {
        throw new Error("Email already exists! Please try a different one.");
      }
      //2.check if client exists in client table
      const clientExists = await clientAccountModel.findOne({
        email: newEmail,
      });
      if (clientExists) {
        throw new Error("Email already exists! Please try a different one.");
      }

      //now unique update all details//then other tables where wClient is

      //update writer table//
      const updatedW = await writerAccountModel.findByIdAndUpdate(
        id,
        { $set: { username, phoneNumber, email: newEmail, accountStatus } },
        { new: true }
      );
      if (!updatedW) {
        throw new Error("Something went wrong! Please try again.");
      }

      //update the rest of the tables//email and username in orders and chat

      //orders table
      const inOrders = await orderModel.updateMany(
        { cWriter: currEmail },
        { $set: { cWriter: newEmail, cUsername: username } }
      );

      //chat table
      const chat = await chatModel.updateMany(
        { cWriter: currEmail },
        { $set: { cWriter: newEmail, cUsername: username } }
      );
      const updateSender = await chatModel.updateMany(
        { sender: currEmail },
        { $set: { sender: newEmail } }
      );
      //writer funds
      const writerFunds = await writerFundModel.updateOne(
        { cWriter: currEmail },
        { $set: { cWriter: newEmail } }
      );
      //update reports
      const writerReport = await writerReportModel.updateMany(
        { cWriter: currEmail },
        { $set: { cWriter: newEmail } }
      );
      //update k2
      const updateKopo = await kopoModel.updateMany(
        { cWriter: currEmail },
        { $set: { cWriter: newEmail } }
      );

      //if any above fails, contact support

      // if(!inOrders.modifiedCount || !chat.modifiedCount){

      //   throw new Error('Oops! Some records may not have updated. Please contact support.')
      // }

      //send success

      res.status(200).json(updatedW);
    } catch (error) {
      
      next(error);
    }
  })

  //remove writer
  .delete(async (req, res, next) => {
    //get writer id /and current of writer email//from fetched//use local storage
    const { id } = req.params;

    try {
      //connection
      await connectDB();

      if (!id) {
        throw new Error("Failed. Missing writer id. Please contact support");
      }

      //check if id is valid ObjectId//ObjectIds is constructed only from 24 hex character strings
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error("Failed! Invalid writer id. Please contact support");
      }
      //check if writer even exist
      const writer = await writerAccountModel.findById(id);
      if (!writer) {
        throw new Error("Failed! Writer not found");
      }

      //then remove
      const removed = await writer.remove();
      if (!removed) {
        throw new Error("Something went wrong! Please try again.");
      }
      //update other tables
      //update the rest of the tables

      //orders table//start means deleted
      const inOrders = await orderModel.updateMany(
        { cWriter: writer.email },
        { $set: { cWriter: `${writer.email}*` } }
      );

      //chat table
      const chat = await chatModel.updateMany(
        { cWriter: writer.email },
        { $set: { cWriter: `${writer.email}*` } }
      );
      const updateSender = await chatModel.updateMany(
        { sender: writer.email },
        { $set: { sender: `${writer.email}*` } }
      );
      //if any above fails, contact support

      //writer funds
      const writerFunds = await writerFundModel.updateOne(
        { cWriter: writer.email },
        { $set: { cWriter: `${writer.email}*` } }
      );
      //update reports
      const writerReport = await writerReportModel.updateMany(
        { cWriter: writer.email },
        { $set: { cWriter: `${writer.email}*` } }
      );
      //update k2
      const updateKopo = await kopoModel.updateMany(
        { cWriter: writer.email },
        { $set: { cWriter: `${writer.email}*` } }
      );

      // if(!inOrders || !chat){

      //   throw new Error('Oops! Some records may not have updated. Please contact support.')
      // }

      res.status(200).json({ id: writer._id });
    } catch (error) {
      next(error);
    }
  });

export default handler;
