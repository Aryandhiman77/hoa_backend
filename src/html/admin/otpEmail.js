export function generateAdminOtpEmail({ otp, adminName }) {
  const currentYear = new Date().getFullYear(); // dynamic year
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HOA Nightmares Admin OTP</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #1d4d2c;
      padding: 20px;
      text-align: center;
    }
    .header img {
      max-width: 180px;
    }
    .body {
      padding: 30px 25px;
      color: #333333;
    }
    .body h1 {
      font-size: 22px;
      color: #1d4d2c;
      margin-bottom: 10px;
    }
    .body p {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .otp-box {
      display: inline-block;
      background: #e6f4ea;
      color: #1d4d2c;
      font-weight: bold;
      font-size: 24px;
      padding: 15px 25px;
      border-radius: 6px;
      margin: 20px 0;
      text-align: center;
      letter-spacing: 3px;
    }
    .footer {
      font-size: 12px;
      color: #777;
      text-align: center;
      padding: 20px;
    }
  </style>
  </head>
  <body>
    <div class="email-wrapper">
      <div class="header">
        <img src="/logo.webp" alt="HOA Nightmares Logo">
      </div>
      <div class="body">
        <h1>Admin OTP Verification</h1>
        <p>Hello ${adminName || "Admin"},</p>
        <p>You've requested to log in to the HOA Nightmares Admin Panel. Use the OTP below to complete your login:</p>
        <div class="otp-box">${otp}</div>
        <p>This OTP is valid for a limited time. Please do not share it with anyone for security reasons.</p>
        <p>Thank you,<br>HOA Nightmares Team</p>
      </div>
      <div class="footer">
        &copy; ${currentYear} HOA Nightmares. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}
