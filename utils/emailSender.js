import nodemailer from "nodemailer";

const sendEmail = ({ from, subject, to, replyTo, body }) => {
  if (!from) {
    //not sent in object/undefined/use default/
    from = "noreply@clientlance.io";
  }
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    name: "mail.clientlance.io",
    host: "mail.clientlance.io",
    port: 465,
    secure: true,
    auth: {
      user: from, //or use process.env.USER,//in env/must match with from below to prevent= sent to spam
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //verify transporter
  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Server is ready to take our message");
    }
  });

  //modify body/html body for email/default
  let htmlBody = `      
<p>Hey,</p>
<p>${body}</p>
<hr>
<p>Please click 'Log In' below to log in to your account.</p>
<p>      
<a href='https://clientlance.io/login' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 15px 0px; padding: 10px 25px; text-transform: capitalize; border-color: #3498db;'>Log in
</a>
</p>  
`;
  //custom html body for confirm email address and contact us
  if (
    subject === "Confirm your email address" ||
    subject === "Message from our user"
  ) {
    htmlBody = `      
  <p>Hey,</p>  
  <p>${body}</p>
  <hr>
  <p>Need help? Please contact us via email: support@clientlance.io or WhatsApp: +254799295587  </p>  
  `;
  }

  //custom to if array use bcc else use to
  let toMany = "";
  let toOne = "";
  Array.isArray(to) ? (toMany = to) : (toOne = to);

  // send mail with defined transport object
  transporter.sendMail(
    {
      from: `"Clientlance" <${from}>`, // sender address
      to: toOne, // comma separated string if many/or array for multiple users
      bcc: toMany, // string or comma separated string or array for multiple users//not visible to others
      subject: subject, // Subject line
      // text: "Hello world?", // plain text body
      replyTo: replyTo || "", //if replyTo is set use it else '' //replyTo omitted//reply to will be sender
      html: htmlBody, // html body
    },
    //callback function/promise settled
    (err, response) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        console.log("Email sent successfully: ", response);
      }
      transporter.close();
    }
  );
};

module.exports = sendEmail;
