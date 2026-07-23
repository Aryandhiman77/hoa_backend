const storyFlagged = (
  name = "there",
  storyTitle = "your story",
  reason = "Your story needs additional review before approval.",
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Story Needs Review</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f8fb; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8fb; padding:30px 15px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">

                <tr>
                  <td align="center" style="padding:30px 25px 15px;">
                    <img src=${process.env.APP_URL + "/hoa_logo.webp"} alt="Website Logo" style="max-width:150px; height:auto;" />
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:10px 25px 0;">
                    <div style="width:70px; height:70px; background:#fff7ed; border-radius:50%; line-height:70px; color:#ea580c; font-size:36px; font-weight:bold;">
                      !
                    </div>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:24px 35px 10px;">
                    <h1 style="margin:0; color:#1f2937; font-size:26px; line-height:1.3;">
                      Your Story Needs Additional Review
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:10px 35px 0;">
                    <p style="margin:0; color:#4b5563; font-size:16px; line-height:1.7;">
                      Hi ${name},
                    </p>

                    <p style="margin:14px 0 0; color:#4b5563; font-size:16px; line-height:1.7;">
                      Your submitted story, <strong>${storyTitle}</strong>, has been marked for additional review by our admin team.
                    </p>

                    <p style="margin:14px 0 0; color:#4b5563; font-size:16px; line-height:1.7;">
                      This does not mean your story is rejected. It only means we need to check it more carefully before taking the next step.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:22px 35px 10px;">
                    <div style="background:#fff7ed; border:1px solid #fed7aa; border-radius:12px; padding:16px;">
                      <p style="margin:0; color:#9a3412; font-size:15px; line-height:1.6;">
                        Review note: ${reason}
                      </p>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:14px 35px 0;">
                    <p style="margin:0; color:#4b5563; font-size:16px; line-height:1.7;">
                      If we need more details from you, our team will contact you through your submitted email address.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:25px 35px 35px;">
                    <a href="/" style="display:inline-block; background:#0f766e; color:#ffffff; text-decoration:none; padding:13px 26px; border-radius:8px; font-size:15px; font-weight:600;">
                      Visit Website
                    </a>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="background:#f9fafb; padding:18px 25px;">
                    <p style="margin:0; color:#6b7280; font-size:13px; line-height:1.5;">
                      This is an automated email. Please do not reply directly to this message.
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

export default storyFlagged;
