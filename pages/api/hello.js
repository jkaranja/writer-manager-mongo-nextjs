
// import clientAccountModel from "../../models/clientAccountModel";
// import jwt from "jsonwebtoken";
// import connectDB from "../../utils/db";

// //client auth
// const protectedClient = async (req, res, next) => {
//   try {
//     //connection
//     await connectDB();
//     //for getting token/testing remove later
//     //  const genToken = (id)=>{
//     //     return  jwt.sign({id}, process.env.JWT_SECRET)
//     //     }
//     //     const tk = genToken("6391f5409f1d62a5d1b53e17");
//     //     res.json({token:tk})

//     //check if token exist and has work Bearer
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       //get token from 'bearer token'//split to array and get index 1 element=token
//       const token = req.headers.authorization.split(" ")[1];
//       //decode and verify token//
//       //returns payload as { id: 'xxxx', iat: 1649517170, exp: 1652109170 }
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       //if success
//       //decode {id: id}, string/secret, {expiresIn: '4m' } //on client side use jwt.decode to check if expired/error
//       //use decoded.id to get user info for posting orders //only when no callback is given
//       //modify the request by adding user object to it /omit password
//       //note {_id:id} = (id) //wrong ({id})=id:id
//       //id is valid format since token is valid//see login//no need to verify format
//       req.user = await clientAccountModel
//         .findById("6391f5409f1d62a5d1b53e17")
//         .select("-password");
//       //test token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNzNlNTQ3M2I0YjNlOGQ2ZWY3ZmMzMyIsImlhdCI6MTY1MTc3NDY2OX0.jedlyP2_SCWK3W5-91nPiT-nVq0YlCaWjHVYUMjr0lE
//       //in case the client got removed but use still has valid local storage token
//       if (!req.user) {
//         throw new Error(
//           `Failed! Something isn't right. Please contact support.`
//         );
//       }

//       res.json(req.user);

//       //then forward the req with user payload
//       next();
//     } else {
//       throw new Error(
//         "Failed! Not authorized. Please try again or contact support."
//       );
//     }
//   } catch (error) {
//     res.json(error.message)
//   }
// };


// export default protectedClient