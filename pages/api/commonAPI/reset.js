import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientAccountModel from "../../../models/clientAccountModel";
import writerAccountModel from "../../../models/writerAccountModel";
import sendEmail from "../../utils/emailSender";
//built-in module for random writer password
import crypto from "crypto";
import errorHandler, { notFound } from "../../../middleware/errorMiddleware";
import connectDB from "../../config/db";
import nc from "next-connect";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

handler.post(async (req, res, next) => {
  //connection
  await connectDB();

  const { email } = req.body;

  try {
    //email not empty
    if (!email) {
      throw new Error("Email required");
    }

    //check client table
    const client = await clientAccountModel.findOne({ email });
    if (client) {
      //if exist generate random password hash and update client table
      ///gen random password password//4=8 character pass
      const password = crypto.randomBytes(4).toString("hex");
      //hash the password for storing in db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //update pass
      const updateClient = await clientAccountModel.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );

      if (!updateClient.modifiedCount) {
        throw new Error("Failed! Something went wrong. Please contact support");
      }
      //then send new password//not hashed
      //Send email using nodemailer
      const emailInfo = {
        subject: "Reset password",
        to: email,
        body: `
                <p>You have successfully reset your password.</p>
                <p>Please use these details to log in to your account:</p>
                <p style="font-weight: bold;">Email: ${email}</p>
                <p style="font-weight: bold;">Password: ${password}</p>  
                <p style="font-style: italic;">Note: Be sure to change your password after you log in.</p>       
                `,
      };
      sendEmail(emailInfo);
      //send//success
      return res.status(200).json({
        _status: "success",
      });
    }

    //email not in client collection
    //check writer table// send writer
    const writer = await writerAccountModel.findOne({ email });
    if (writer) {
      //if exist generate random password hash and update client table
      ///gen random password password//4=8 character pass
      const password = crypto.randomBytes(4).toString("hex");
      //hash the password for storing in db
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updateWriter = await writerAccountModel.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
      if (!updateWriter.modifiedCount) {
        throw new Error("Failed! Something went wrong. Please contact support");
      }
      //then send new password
      //Send email using nodemailer
      const emailInfo = {
        subject: "Reset password",
        to: email,
        body: `
                <p>You have successfully reset your password.</p>
                <p>Please use these details to log in to your account:</p>
                <p style="font-weight: bold;">Email: ${email}</p>
                <p style="font-weight: bold;">Password: ${password}</p>  
                <p style="font-style: italic;">Note: Be sure to change your password after you log in.</p>       
                `,
      };
      sendEmail(emailInfo);
      //send//success
      return res.status(200).json({
        _status: "success",
      });
    }

    throw new Error("Email not found! Please check again or contact support.");
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
