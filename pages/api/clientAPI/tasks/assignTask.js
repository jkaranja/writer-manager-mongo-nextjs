import nc from "next-connect";
import connectDB from "../../../../config/db";

import sendEmail from "../../../../utils/emailSender";

import writerAccountModel from "../../../../models/writerAccountModel";

import errorHandler, { notFound } from "../../../../middleware/errorMiddleware";
import { protectedClient } from "../../../../middleware/authMiddleware";

import uploadInst from "../../../../middleware/fileUploadInst";
import taskModel from "../../../../models/taskModel";
import multer from "multer";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

// Adds the middleware to Next-Connect
handler
  .use(protectedClient)

  .use(uploadInst.array("files"))

  .post(async (req, res, next) => {
    //loop and get instruction fileNames only
   

    const { id } = req.user;

    const { files } = req;

    const instructionFiles = files.length
      ? files.map((file) => file.filename)
      : [];

    const {
      title,
      budget,
      deadline,
      instructions,
      cWriter,
    } = req.body;

    

    try {
      //connection
      await connectDB;

      if (!title || !budget || !deadline) {
        throw new Error("Failed! Fill required fields and try again.");
      }

      const task = await taskModel.create({
        wClient: id,
        [cWriter === "pool" ? "xW" : "cWriter"]: cWriter,
        title,
        budget,
        deadline,
        taskStatus: cWriter === "pool" ? "Pool" : "Ongoing",
        instructions,
        instructionFiles,
      });

      if (!task) {
        throw new Error("Failed! Something went wrong. Please try again.");
      }

      /**-----------------------
         * EMAIL NOTIFICATIONS
         --------------------------*/
      const writers = await writerAccountModel.find({ wClient: id });
      //pool=>all client's writers
      if (cWriter === "pool") {      

        const writerEmails = writers.map((writer) => writer.email);

        const emailInfo = {
          subject: "New task available",
          to: writerEmails,
          body: `<p>Good news! There is a new task available.</p>                  
                          `,
        };
        sendEmail(emailInfo);
        //one writers
      } else {
        const emailInfo = {
          subject: "You have been assigned a special request task",
          to: cWriter,
          body: `
                      <p>Congrats! You have been assigned a special request task.</p>                  
                      `,
        };
        sendEmail(emailInfo);
      }

      res.status(201).json({ _status: "success" });
    } catch (error) {
      next(error);
    }
  });

export default handler;
//to consume req.body as stream, disable body parsing. By default, Next.js automatically parses the API request body.

//in express, we are only parsing content-type app/json and x-www-form-urlencoded
//using: app.use(express.json());//app.use(express.urlencoded({ extended: true }));
//in NEXTJS, it's body parser parses all types of data streams in the body of req
//data in the req is sent as streams and has to be parsed req.on("data", cb) into req.body object
//headers can be access at req.headers // no parsing//not sent as stream
export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
