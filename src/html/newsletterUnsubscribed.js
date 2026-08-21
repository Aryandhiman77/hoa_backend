const newsletterUnsubscribed = (name = "there", email = "") => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Newsletter Unsubscribed</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#f4f8fb;
          font-family:Arial, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="background:#f4f8fb; padding:30px 15px;"
        >
          <tr>
            <td align="center">

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  max-width:600px;
                  background:#ffffff;
                  border-radius:16px;
                  overflow:hidden;
                  box-shadow:0 8px 30px rgba(0,0,0,0.08);
                "
              >

                <!-- Logo -->
                <tr>
                  <td align="center" style="padding:30px 25px 15px;">
                    <img
                      src="${process.env.APP_URL}/hoa_logo.png"
                      alt="HOA Logo"
                      style="max-width:150px; height:auto;"
                    />
                  </td>
                </tr>

                <!-- Unsubscribe Icon -->
                <tr>
                  <td align="center" style="padding:10px 25px 0;">
                    <div
                      style="
                        width:70px;
                        height:70px;
                        background:#fff7ed;
                        border-radius:50%;
                        line-height:70px;
                        color:#ea580c;
                        font-size:34px;
                        font-weight:bold;
                      "
                    >
                      ✓
                    </div>
                  </td>
                </tr>

                <!-- Heading -->
                <tr>
                  <td align="center" style="padding:24px 35px 10px;">
                    <h1
                      style="
                        margin:0;
                        color:#1f2937;
                        font-size:26px;
                        line-height:1.3;
                      "
                    >
                      You Have Been Unsubscribed
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:10px 35px 0;">

                    <p
                      style="
                        margin:0;
                        color:#4b5563;
                        font-size:16px;
                        line-height:1.7;
                      "
                    >
                      Hi ${name},
                    </p>

                    <p
                      style="
                        margin:14px 0 0;
                        color:#4b5563;
                        font-size:16px;
                        line-height:1.7;
                      "
                    >
                      Your email address has been successfully unsubscribed
                      from the Home Owners Attorney newsletter.
                    </p>

                    <p
                      style="
                        margin:14px 0 0;
                        color:#4b5563;
                        font-size:16px;
                        line-height:1.7;
                      "
                    >
                      You will no longer receive HOA Nightmares newsletters,
                      updates, or other newsletter communications from us.
                    </p>

                  </td>
                </tr>

                <!-- Email Details -->
                <tr>
                  <td style="padding:24px 35px 10px;">

                    <div
                      style="
                        background:#fff7ed;
                        border:1px solid #fed7aa;
                        border-radius:12px;
                        padding:18px;
                      "
                    >

                      <p
                        style="
                          margin:0 0 8px;
                          color:#475569;
                          font-size:13px;
                          line-height:1.5;
                          font-weight:600;
                          text-transform:uppercase;
                          letter-spacing:0.5px;
                        "
                      >
                        Unsubscribed Email
                      </p>

                      <p
                        style="
                          margin:0;
                          color:#c2410c;
                          font-size:17px;
                          line-height:1.5;
                          font-weight:700;
                          word-break:break-word;
                        "
                      >
                        ${email}
                      </p>

                    </div>

                  </td>
                </tr>

                <!-- Status -->
                <tr>
                  <td style="padding:14px 35px 10px;">

                    <div
                      style="
                        background:#f8fafc;
                        border:1px solid #e2e8f0;
                        border-radius:12px;
                        padding:16px;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          color:#475569;
                          font-size:15px;
                          line-height:1.6;
                        "
                      >
                        <strong>Status:</strong> Unsubscribed
                      </p>
                    </div>

                  </td>
                </tr>

                <!-- Re-subscribe Information -->
                <tr>
                  <td style="padding:14px 35px 0;">

                    <p
                      style="
                        margin:0;
                        color:#4b5563;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      Changed your mind? You can subscribe again at any time
                      through our website.
                    </p>

                  </td>
                </tr>

                <!-- Website Button -->
                <tr>
                  <td align="center" style="padding:25px 35px 35px;">

                    <a
                      href="${process.env.APP_URL}"
                      style="
                        display:inline-block;
                        background:#0f766e;
                        color:#ffffff;
                        text-decoration:none;
                        padding:13px 26px;
                        border-radius:8px;
                        font-size:15px;
                        font-weight:600;
                      "
                    >
                      Visit Website
                    </a>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      background:#f9fafb;
                      padding:18px 25px;
                    "
                  >
                    <p
                      style="
                        margin:0;
                        color:#6b7280;
                        font-size:13px;
                        line-height:1.5;
                      "
                    >
                      This is an automated email. Please do not reply directly
                      to this message.
                    </p>
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export default newsletterUnsubscribed;
