const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch((err) =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}


const sendEmail = async (to, subject, html) => {
  const msg = { from: config.email.from, to, subject, html };
  await transport.sendMail(msg);
};

const sendEmailVerification = async (to, otp) => {
  console.log("sendEmailVerification", to, otp);
  const subject = "User verification code";
  const html = `
   <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
    <div
        style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: center;">
        <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/Ghorbari.png"
            alt="Ghorbari" style="max-width: 10rem; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">Welcome to Ghorbari
        </h1>
        <p style="color: #4b5563; margin-bottom: 1.5rem;">Thank you for joining Ghorbari! Your account is almost
            ready.</p>
        <div
            style="background: linear-gradient(135deg, #FF6625, #d3541dbf); color: #ffffff; padding: 1rem; border-radius: 0.5rem; font-size: 2rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem;">
            ${otp}
        </div>
        <p style="color: #4b5563; margin-bottom: 1.5rem;">Collect this code to verify your account.</p>
        <p style="color: #e6441c; font-size: 0.85rem; margin-top: 1.5rem;">This code expires in <span
                id="timer">3:00</span>
            minutes.</p>
        <a href="https://shadat-hossain.netlify.app" style="color: #888; font-size: 12px; text-decoration: none;"
            target="_blank">ᯤ
            Develop by ᯤ</a>
    </div>
`;
  await sendEmail(to, subject, html);
};

const sendResetPasswordEmail = async (to, otp) => {
  console.log("Password Reset Email", to, otp);
  const subject = "Password Reset Email";
  const html = `
       <body style="background-color: #f3f4f6; padding: 2rem; font-family: Arial, sans-serif; color: #333;">
          <div
              style="max-width: 32rem; margin: 0 auto; background-color: #ffffff; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); text-align: center;">
              <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/Ghorbari.png"
                  alt="Ghorbari" style="max-width: 8rem; margin-bottom: 1.5rem;">
              <h1 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 1rem; color: #1f2937;">Password Reset Request
              </h1>
              <p style="color: #4b5563; margin-bottom: 1.5rem;">You requested a password reset for your account. Use the code
                  below to reset your password:</p>
              <div
                  style="background: linear-gradient(135deg, #fe773dcb, #FF6625); color: #ffffff; padding: 1rem; border-radius: 0.5rem; font-size: 2rem; font-weight: 800; letter-spacing: 0.1rem; margin-bottom: 1.5rem;">
                  ${otp}
              </div>
              <p style="color: #d6471c; margin-bottom: 1.5rem;">Collect this code to reset your password. This code is valid
                  for
                  3
                  minutes.</p>
              <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1.5rem;">If you did not request a password reset,
                  please ignore this email.</p>
              <a href="https://shadat-hossain.netlify.app" style="color: #888; font-size: 12px; text-decoration: none;"
                  target="_blank">ᯤ
                  Develop by ᯤ</a>
          </div>
      </body>
`;
  await sendEmail(to, subject, html);
};

const sendContactsUsEmail = async (allData) => {
  const to = allData.propertyOwnerEmail ? allData.propertyOwnerEmail : process.env.CONTACT_US_EMAIL;
  const subject = `Contact Us Email - ${allData.fullName} from Doctor Appointment e-clinic`;
  const html = `
 <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb; color: #333;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://raw.githubusercontent.com/shadat-hossan/Image-server/refs/heads/main/Ghorbari.png" alt="Ghorbari Logo" style="max-width: 100px; margin-bottom: 10px;">
      <h1 style="font-size: 1.75rem; color: #e6441c; margin: 0;">Contact Us Submission</h1>
    </div>
    <div style="background: linear-gradient(135deg, #e6441c, #f17657); padding: 20px; border-radius: 10px; color: #ffffff; margin-top: 20px;">
      <h2 style="font-size: 1.5rem; margin: 0; text-align: center;">New Message from ${allData.fullName}</h2>
    </div>
    <div style="padding: 20px 0;">
      <p style="font-size: 1.125rem; line-height: 1.6; margin-bottom: 15px;">
        <strong style="color: #e6441c;"><i style="margin-right: 8px;">📧</i>Email Address:</strong> ${allData.email}
      </p>
      <p style="font-size: 1.125rem; line-height: 1.6; margin-bottom: 15px;">
        <strong style="color: #e6441c;"><i style="margin-right: 8px;">📞</i>Phone:</strong> ${allData.phoneNumber}
      </p>
      <p sty
      <p style="font-size: 1.125rem; line-height: 1.6; margin-bottom: 15px;">
        <strong style="color: #e6441c;"><i style="margin-right: 8px;">💬</i>Message:</strong> ${allData.message}
      </p>
    </div>
    <div style="text-align: center; padding: 20px; background-color: #f3f4f6; border-radius: 10px; margin-top: 30px;">
      <p style="font-size: 0.875rem; color: #555;">
        This email was sent from the "Contact Us" form on the Ghorbari website.
      </p>
    </div>
  </div>
</body>`;

  await sendEmail(to, subject, html);
};



const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailVerification,
  sendContactsUsEmail,
};
