import nodemailer from "nodemailer";

//todo : transporter to be configured for gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.COMPANY_GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});
export default async function mailSender({ from, to, subject, html }) {
  const info = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html,
  });
  if (info) {
    console.log(`Mail sent to ${to} with id: ${info.messageId}`);
    return true;
  } else {
    return false;
  }
}
