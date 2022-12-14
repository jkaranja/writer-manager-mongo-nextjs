//register//
import connectDB from "../../../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../../../../utils/emailSender";
import crypto from "crypto";
import axios from "axios";
import writerAccountModel from "../../../../models/writerAccountModel";
import clientAccountModel from "../../../../models/clientAccountModel";
import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";
import next from "next";

import nc from "next-connect";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

//REGISTER

handler.post(async (req, res, next) => {
  //destructure req.bdy
  const { username, email, password, captchaToken } = req.body;

  try {
    //connection
    await connectDB();
    //check if all these are not empty
    if (!username || !email || !password || !captchaToken) {
      throw new Error("All fields required. Check reCAPTCHA as well.");
    }

    //verify reCAPTCHA using axios
    // Call Google's API to get score
    //returns obj = {data: { success: true, challenge_ts: ‘2021–10–18T04:33:00Z’, hostname: ‘localhost’}}
    const captchaScore = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    );
    // Extract result from the API response
    if (!captchaScore.data.success) {
      throw new Error(
        "Failed! Bot detected. Please contact support if you're human."
      );
    }
    //end of captcha

    //1.check if writer exists in writer table
    const writerExists = await writerAccountModel.findOne({ email });
    if (writerExists) {
      throw new Error(
        "Email already exists! Please try a different one or log in."
      );
    }
    //2.check if client exists in client table
    const clientExists = await clientAccountModel.findOne({ email });
    if (clientExists) {
      throw new Error(
        "Email already exists! Please try a different one or log in."
      );
    }

    //3.email doesn't exist in both tables//proceed to register in client table
    ///hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //4.gen random string for activation key
    const randomKey = crypto.randomBytes(20).toString("hex");
    //.5. //register user//returns inserted doc/record
    const user = await clientAccountModel.create({
      username,
      email,
      password: hashedPassword,
      confirmKey: randomKey,
    });
    //6. sending email
    //include a client url with a page with key/id query string/
    //Send email using nodemailer
    const emailInfo = {
      subject: "Confirm your email address",
      to: email,
      body: `
                <p>Please click the button below to confirm your email address:</p> 
                <a href ='http://localhost:3000/confirm/?id=${user.id}&key=${randomKey}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px 0px; padding: 10px 25px; text-transform: capitalize; border-color: #3498db;'>Confirm email address
                </a>               
                `,
    }; //live link
    // <a href='https://clientlance.io/confirm/?id=${user.id}&key=${randomKey}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;'>Confirm email address
    //     </a>
    sendEmail(emailInfo);
    res.status(201).json({
      _status: "success",
    });
  } catch (error) {
    next(error);
  }
});

export default handler;
