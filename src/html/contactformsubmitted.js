export default function (name) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Form Submitted Successfully</title>

    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      }

      body {
        min-height: 100vh;
        background: #f4f8fb;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .success-wrapper {
        width: 100%;
        max-width: 520px;
        background: #ffffff;
        border-radius: 18px;
        padding: 40px 30px;
        text-align: center;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
      }

      .logo-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 25px;
      }

      .logo-box img {
        max-width: 160px;
        height: auto;
      }

      .success-icon {
        width: 78px;
        height: 78px;
        background: #e8f8ef;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 22px;
        color: #1faa59;
        font-size: 42px;
        font-weight: bold;
      }

      h1 {
        font-size: 28px;
        color: #1f2937;
        margin-bottom: 12px;
      }

      p {
        font-size: 16px;
        color: #5f6b7a;
        line-height: 1.6;
        margin-bottom: 28px;
      }

      .btn {
        display: inline-block;
        padding: 13px 26px;
        background: #0f766e;
        color: #ffffff;
        text-decoration: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        transition: 0.3s ease;
      }

      .btn:hover {
        background: #115e59;
      }

      @media (max-width: 480px) {
        .success-wrapper {
          padding: 32px 20px;
        }

        h1 {
          font-size: 24px;
        }

        p {
          font-size: 15px;
        }

        .logo-box img {
          max-width: 135px;
        }
      }
    </style>
  </head>
  <body>
    <div class="success-wrapper">
      <div class="logo-box">
        <img src=${process.env.APP_URL + "/hoa_logo.png"} alt="Website Logo" />
      </div>

      <div class="success-icon">✓</div>

      <h1>Contact Form Submitted Successfully</h1>

      <p>
        Thank you <strong>${name}</strong> for contacting us. Your message has been received
        successfully. Our team will get back to you as soon as possible.
      </p>

      <a href="/" class="btn">Back to Home</a>
    </div>
  </body>
</html>
`;
}
