import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientAccountModel from "../../../models/clientAccountModel";
import writerAccountModel from "../../../models/writerAccountModel";

import connectDB from "../../config/db";
import errorHandler, { notFound } from "../../../middleware/errorMiddleware";

import nc from "next-connect";


//nc will handle error errorHandler
//onError: (err,req,res,next)=>{}
//this collects all errors in middleware//
//in routes, use try catch and pass an error to next(error)//no need
const handler = nc({
  onError: errorHandler, //pass your error handler function here with same params as express
  onNoMatch: notFound, //your 404 route not found//eg no method matched
});
///you can chain like nc().post().get//or handler.post().get() //OR call handler for every mtd. handler.get() handler.post

handler.post(async (req, res, next) => {
  //connection
  await connectDB();
  const { email, password } = req.body;
  //check if user exist/login/send token
  //check if user exist/login/send token
  try {
    //not empty
    if (!email || !password) {
      throw new Error("All fields required");
    }

    //check client table
    const client = await clientAccountModel.findOne({ email });
    if (client) {
      //check account status//confirmed
      if (client.emailStatus !== "confirmed") {
        throw new Error(
          "Failed! Please confirm your email address first or contact support for assistance."
        );
      }
      //compare password//returns boolean
      const passwordCheck = await bcrypt.compare(password, client.password);
      //returns false if not match//true otherwise
      if (!passwordCheck) {
        throw new Error("Failed! Wrong password. Please check again.");
      }
      //send//check userType//stored in localStorage//access like data.email/token
      return res.status(200).json({
        _id: client._id,
        _userType: "client",
        email: client.email,
        username: client.username,
        phoneNumber: client.phoneNumber,
        token: genToken(client._id),
      });
    }
    //check writer table// send writer
    const writer = await writerAccountModel.findOne({ email });
    if (writer) {
      ////check accountStatus
      if (writer.accountStatus !== "approved") {
        throw new Error(
          "Your client has suspended your account. Please contact them for more details."
        );
      }

      //compare password
      const passwordCheck = await bcrypt.compare(password, writer.password);
      if (!passwordCheck) {
        throw new Error("Wrong password! Please check again.");
      }
      //send//check userType//stored in localStorage//access like data.email/token
      return res.status(200).json({
        _id: writer._id,
        _userType: "writer",
        email: writer.email,
        username: writer.username,
        client: writer.wClient,
        phoneNumber: writer.phoneNumber,
        token: genToken(writer._id),
      });
    }

    throw new Error("Email not found! Please check again or sign up.");
  } catch (error) {
    next(error);
  }
});

//function will be defined by the time it is called above after await keyword pause
//create jwt token function
const genToken = (id) => {
  //don't expire/remove expr
  //return  jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '3d'})
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export default handler;
