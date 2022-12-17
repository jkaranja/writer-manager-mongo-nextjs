import connectDB from "../../../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../../utils/emailSender";
import crypto from "crypto";
import writerAccountModel from "../../../../models/writerAccountModel";
import clientAccountModel from "../../../../models/clientAccountModel";
import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";
import { protectedClient } from "../../../../middleware/authMiddleware";
import Task from "../../../../models/taskModel";

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
  })

  //get all writers
  .get(async (req, res, next) => {
    const { id } = req.user;

    try {
      //connection
      await connectDB();

      let query = Task.find({
        $and: [
          { wClient: id },
          {
            $or: [
              { taskStatus: { $ne: "archived" } },
              { taskStatus: { $ne: "completed" } },
            ],
          },
        ],
      })
        .sort({ updatedAt: -1 })
        .populate("cWriter", "username email -_id");

      /**----------------------------------
         * PAGINATION
      ------------------------------------*/
      let { page, size } = req.query;

      page = parseInt(page) || 1; //current page no. / sent as string convert to number//page not sent use 1
      size = parseInt(size) || 15; //items per page//if not sent from FE/ use default 15
      const skip = (page - 1) * size; //eg page = 5, it has already displayed 4 * 10//so skip prev items
      const total = await Task.find().count(); //Task.countDocument() ///total docs 
      //if total = 0 //error
      if (!total) {
        throw new Error("No record found.");
      }

      const pages = Math.ceil(total / size);

      query = query.skip(skip).limit(size); //you can use projection,  .find({}, {limit, skip})

      //in case invalid page is sent//out of range//not from the pages sent
      if (page > pages) {
        throw new Error("No page found");
      }

      const result = await query;

      res.status(200).json({
        page,
        pages,
        count: result.length,
        result,
      });
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
