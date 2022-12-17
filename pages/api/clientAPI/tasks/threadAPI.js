import nc from "next-connect";
import connectDB from "../../../../config/db";

import writerAccountModel from "../../../../models/writerAccountModel";

import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";
import { protectedClient } from "../../../../middleware/authMiddleware";

import taskModel from "../../../../models/taskModel";

import fileUploadThr from "../../../../middleware/fileUploadThr";
import threadModel from "../../../../models/threadModel";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

// Adds the middleware to Next-Connect
handler
  .use(protectedClient)

  .use(fileUploadThr.array("files"))

  .post(async (req, res, next) => {
    //loop and get instruction fileNames only

    const { files } = req;

    const threadFiles = files.length ? files.map((file) => file.filename) : [];

    const { task, sender, threadMessage } = req.body;

    try {
      //connection
      await connectDB;

      if (!task || !sender || !threadMessage) {
        throw new Error("Failed! Please reload page and try again.");
      }

      const threadMes = await threadModel.create({
        task,
        sender,
        threadMessage,
        threadFiles,
      });

      if (!threadMes) {
        throw new Error("Failed! Something went wrong. Please try again.");
      }

      res.status(201).json(threadMes);
    } catch (error) {
      next(error);
    }
  });

export default handler;
//to consume req.body as stream, disable body parsing. By default, Next.js automatically parses the API request body.
//multer needs the data sent untouched/parsed/as streams/ so it parses the multipart data/ and upload files and forward the req by next()
//note that if the headers content-type is not multipart/form-data, multer will skip, you have disabled next parsing to false so req.body will be undefined, i.e
//the data will not be parsed at all
//in express, it will work just// express.json() //will not parse the data if it has files/// also sets the correct headers for multer
//in express, we are only parsing content-type app/json and x-www-form-urlencoded
//using: app.use(express.json());//app.use(express.urlencoded({ extended: true }));
//in NEXTJS, it's body parser parses all types of data streams in the body of req
//data in the req is sent as streams/parts/not whole and has to be parsed req.on("data", cb) into req.body object
//parsing means the middleware receives parts of data as streams and as data comes in, it keeps putting the parts together into actual usable js object/req.body
//headers can be access at req.headers // no parsing//not sent as stream
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
