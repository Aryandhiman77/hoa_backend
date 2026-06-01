import dns from "dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");
//todo : transporter to be configured for gmail
const transporter = nodemailer.createTransport({
  port: 587,
  secure: false,
  family: 4,
  service: "gmail",
  auth: {
    user: process.env.COMPANY_GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  requireTLS: true,
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
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
