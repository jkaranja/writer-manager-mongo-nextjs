//https://www.webmound.com/download-file-using-express-nodejs-server/
// var zip = require("express-zip");
// app.get('/', function(req, res) {
//   res.zip([
//     { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' }
//     { path: '/path/to/file2.name', name: 'file2.name' }
//   ]);
// });
//  
// app.listen(3000);

// //prev
// const express = require("express");
// const path = require("path");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const fs = require("fs");
// //auth/protected middleware
// router.get("/", (req, res, next) => {
//   const { parts, token } = req.query;
//   const fileName = decodeURIComponent(req.query.fileName);
//   //filePath= ${__dirname}/uploads/file.docx
//   const filePath = path.resolve(__dirname, "../", "../", parts, fileName);
  
//   try {
//     //for zipped files//use express-zip library
//     //check if file exists
//     //returns null or err object //err.code='ENOENT'
//     fs.stat(filePath, (err, stat) => {
//       if (err === null) {
//         //download only when token is valid//sent to user//if not correct=jwt malformed/wrong format=invalid token/ or "jwt must be provided" if missing//exit
//         //decodes and compares secret //user exist in db not checked//not necessary
//         try {
//           const decoded = jwt.verify(token, process.env.JWT_SECRET); //returns {id, iat} or error obj
//           //download if jwt valid
//           res.download(filePath); //sets content disposition & content type//res.download(filePath, customFilename)
//         } catch (error) {
//           return res.status(401).json({
//             Error: "Failed! Not authorized. Please contact support.",
//           });
//         }
//       } else {
//         res.status(400).json({
//           Error: "File not found. Please contact support.",
//         });
//       }
//     });
//   } catch (error) {
//     res.status(400);
//     next(error);
//   }
// });

// module.exports = router;
