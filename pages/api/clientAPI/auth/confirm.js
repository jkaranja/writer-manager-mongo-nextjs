import jwt from "jsonwebtoken";
import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";

import clientAccountModel from "../../../../models/clientAccountModel";
import connectDB from "../../../../config/db";
import nc from "next-connect";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

//CONFIRM EMAIL
handler.post(async (req, res, next) => {
  //client: send this id and key on page load//axios
  //client//use useLocation to get these from url
  const { id, key } = req.body;

  try {
    //connection
    await connectDB();

    
    //
    if (!key || !id) {
      throw new Error(
        "Failed! Please use the link that we sent or contact support."
      );
    }

    //check if id is valid ObjectId//ObjectIds is constructed only from 24 hex character strings
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(
        "Failed! Please use the link that we sent or contact support."
      );
    }

    //check if id and key match//get record by id first
    const user = await clientAccountModel.findById(id);
    if (!user) {
      throw new Error("User not found. Please contact support.");
    }
    //check if status is already confirmed
    if (user.emailStatus === "confirmed") {
      throw new Error(
        "Your email address is already confirmed. Please log in."
      );
    }
    //compare key and activate
    if (key !== user.confirmKey) {
      throw new Error("Invalid key. Please contact support.");
    }
    //finally update status
    //activate
    const confirm = await clientAccountModel.findByIdAndUpdate(
      id,
      {
        $set: {
          emailStatus: "confirmed",
        },
      },
      { new: true }
    );

    //send status//if ok/redirect user to login
    res.status(200).json({
      _id: confirm._id,
      _userType: "client",
      email: confirm.email,
      username: confirm.username,
      phoneNumber: confirm.phoneNumber,
      token: genToken(confirm._id),
    });
  } catch (error) {
    
    next(error);
  }
});

//gen token
const genToken = (id) => {
  //don't expire/remove expr
  //return  jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '3d'})
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export default handler;
