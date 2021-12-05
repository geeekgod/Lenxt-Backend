const nodemailer = require("nodemailer");

const sendOtpToMail = (req, res, otp) => {
  {
    const output = `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #8338cc;text-decoration:none;font-weight:600">Lenxt App</a>
          </div>
          <p>Forgot your password? Use the following OTP to reset your password,</p>
          <h2 style="background: #8338cc;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Lenxt App</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>The Lenxt</p>
            <p>India</p>
          </div>
        </div>
      </div>`;
    let transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: `"Lenxt App" <${process.env.MAILER_EMAIL}>`,
      to: req.body.email,
      subject: "Password Reset OTP",
      html: output,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.json({ msg: "otp sent" });
    });
  }
};

module.exports = sendOtpToMail;
