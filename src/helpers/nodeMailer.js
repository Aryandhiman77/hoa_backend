import dns from "dns";
import nodemailer from "nodemailer";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  requireTLS: true,

  auth: {
    user: process.env.COMPANY_GMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

export default async function mailSender({ from, to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"HOA Support" <${process.env.COMPANY_GMAIL}>`,
      to,
      replyTo: from,
      subject,
      html,
    });

    console.log(`Mail sent to ${to} with id: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Mail sending failed:", error.message);
    return false;
  }
}