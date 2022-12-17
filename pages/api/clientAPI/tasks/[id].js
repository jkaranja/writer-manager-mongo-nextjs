//edit and remove //routes.route('/:id).put().delete(protected, )

//req.query.id  //pages/api/post/[pid].js

import connectDB from "../../../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../../utils/emailSender";
import crypto from "crypto";
import writerAccountModel from "../../../../models/writerAccountModel";
import clientAccountModel from "../../../../models/clientAccountModel";
import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";
import { protectedClient } from "../../../../middleware/authMiddleware";
import taskModel from "../../../../models/taskModel";

import nc from "next-connect";
import threadModel from "../../../../models/threadModel";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

//client register writer
handler

  //get all writers
  .get(async (req, res, next) => {
    const {
      query: { id },
    } = req;

    try {
      //connection
      await connectDB();
      const task = await taskModel.findById(id);
      //doc or null
      if (!task) {
        throw new Error("No record found.");
      }

      const thread = await threadModel.find({ task: id });

      if (thread.length) {
        return res.status(200).json({ task, thread });
      }

      res.status(200).json({ task });
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
