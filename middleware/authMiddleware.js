import writerAccountModel from "../models/writerAccountModel";
import clientAccountModel from "../models/clientAccountModel";
import jwt from "jsonwebtoken";
import connectDB from "../config/db";



//client auth
export const protectedClient = async (req, res, next) => {
  try {
    //connection//will cause Operation `users.findOne()` buffering timed out after 10000ms if no db conn
    await connectDB();
    //for getting token/testing remove later
    // const genToken = (id)=>{
    //    return  jwt.sign({id}, process.env.JWT_SECRET)
    //    }
    //    const tk=genToken('62742d9a11605c531138b071')
    //    res.json({token:tk})

    //check if token exist and has work Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //get token from 'bearer token'//split to array and get index 1 element=token
      const token = req.headers.authorization.split(" ")[1];
      //decode and verify token//
      //returns payload as { id: 'xxxx', iat: 1649517170, exp: 1652109170 }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //if success
      //decode {id: id}, string/secret, {expiresIn: '4m' } //on client side use jwt.decode to check if expired/error
      //use decoded.id to get user info for posting orders //only when no callback is given
      //modify the request by adding user object to it /omit password
      //note {_id:id} = (id) //wrong ({id})=id:id
      //id is valid format since token is valid//see login//no need to verify format
      req.user = await clientAccountModel
        .findById(decoded.id)
        .select("-password");
      //test token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzNlNTQ3M2I0YjNlOGQ2ZWY3ZmMzMyIsImlhdCI6MTY1MTc3NDY2OX0.jedlyP2_SCWK3W5-91nPiT-nVq0YlCaWjHVYUMjr0lE
      //in case the client got removed but use still has valid local storage token
      if (!req.user) {
        throw new Error(
          `Failed! Something isn't right. Please contact support.`
        );
      }
      //then forward the req with user payload
      next();
    } else {
      throw new Error(
        "Failed! Not authorized. Please try again or contact support."
      );
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

//writer auth
export const protectedWriter = async (req, res, next) => {
  try {
    //check if token exist and has work Bearer
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //get token from 'bearer token'//split to array and get index 1 element=token
      const token = req.headers.authorization.split(" ")[1];
      //decode and verify token//callback given//executed asynchronously using callbacks
      //returns payload as { id: 'xxxx', iat: 1649517170, exp: 1652109170 }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //id is valid format since token is valid//see login//no need to verify format

      //check writer is not removed and still has approved status
      req.user = await writerAccountModel
        .findById(decoded.id)
        .select("-password");
      //in case writer is removed by client but they still got valid token
      if (!req.user) {
        throw new Error(
          `Failed! Your client has removed you from our system. Please contact them.`
        );
      }
      //writer exist/now check status/approved
      if (req.user.accountStatus !== "approved") {
        throw new Error(
          `Failed! Your client has suspended you. Please contact them.`
        );
      }

      //then forward the req with user payload
      next();
    } else {
      throw new Error(
        "Failed! Not authorized. Please try again or contact support."
      );
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};
