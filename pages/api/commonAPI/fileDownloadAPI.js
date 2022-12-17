import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

import errorHandler, { notFound } from "../../../middleware/errorMiddleware";

import nc from "next-connect";

const handler = nc({
  onError: errorHandler,
  onNoMatch: notFound,
});

//client register writer
handler
  .use(async (req, res, next) => {
    const { token } = req.query;
    try {
      //download only when token is valid//sent to user//if not correct=jwt malformed/wrong format=invalid token/ or "jwt must be provided" if missing//exit
      //decodes and compares secret //user exist in db not checked//not necessary
      //will throw error if token is not valid
      jwt.verify(token, process.env.JWT_SECRET); //returns {id, iat} or error obj
      //forward req
      next(); //you must call next to forward request to next middleware.
      //all middleware must call next to forward req, in express & here/next-connect, next() call next middleware
      //next(err) call error middleware/ here onError:
      //even the ones in server.js calls next in express eg multer//only error middleware is terminating req with res
    } catch (error) {
      res.status(401);
      next(error);
    }
  })
  .get(async (req, res, next) => {
    const { parts } = req.query;

    const fileName = decodeURIComponent(req.query.fileName);
    //filePath= ${__dirname}/uploads/file.docx

    const filePath = path.resolve(`${parts}/${fileName}`); //returns project root/upload folder/
    // path.resolve(__dirname, "../", "../", parts, fileName); //will include project roo/.next/api/pages/upload/file

    ///set content-type for headers based on file type
    let ext = fileName.split(".").pop();

    let contentType;

    switch (ext) {
      case "pdf":
        contentType = "application/pdf";
        break;
      case "exe":
        contentType = "application/octet-stream";
        break;
      case "zip":
        contentType = "application/zip";
        break;
      case "doc":
        contentType = "application/msword";
        break;
      case "docx":
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case "xls":
        contentType = "application/vnd.ms-excel";
        break;
      case "ppt":
        contentType = "application/vnd.ms-powerpoint";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "jpeg": //combine to jpg//no break// continue to next
      case "jpg":
        contentType = "image/jpg";
        break;
      default:
        contentType = "application/force-download";
    }

    try {
      //ref: https://www.webmound.com/download-file-using-express-nodejs-server/
      //check if file exists
      //returns null or err object //err.code='ENOENT'
      fs.stat(filePath, (err, stat) => {
        if (err === null) {
          const stream = fs.createReadStream(filePath);

          res.setHeader("Content-Type", `${contentType}`);
          res.setHeader("Content-Disposition", `inline; filename=${fileName}`);
          //   res.setHeader("Content-Disposition", 'inline; filename="js.pdf"');
          stream.pipe(res);
        } else {
          res.status(404).json({
            Error: "File not found. Please contact support.",
          });
        }
      });
    } catch (error) {
      next(error);
    }
  });

export default handler;
