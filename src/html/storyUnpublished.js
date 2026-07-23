const storyUnpublished = (
  name = "there",
  storyTitle = "your story",
  reason = "Your story has been unpublished by the administration.",
) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Story Has Been Unpublished</title>
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
                  <div style="width:70px; height:70px; background:#fff1f2; border-radius:50%; line-height:70px; color:#b91c1c; font-size:36px; font-weight:bold;">
                    !
                  </div>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:24px 35px 10px;">
                  <h1 style="margin:0; color:#1f2937; font-size:26px; line-height:1.3;">
                    Your Story Has Been Unpublished
                  </h1>
                </td>
              </tr>

              <tr>
                <td style="padding:10px 35px 0;">
                  <p style="margin:0; color:#4b5563; font-size:16px; line-height:1.7;">
                    Hi ${name},
                  </p>

                  <p style="margin:14px 0 0; color:#4b5563; font-size:16px; line-height:1.7;">
                    Your submitted story, <strong>${storyTitle}</strong>, has been unpublished by our admin team.
                  </p>

                  <p style="margin:14px 0 0; color:#4b5563; font-size:16px; line-height:1.7;">
                    Reason: ${reason}
                  </p>

                  <p style="margin:14px 0 0; color:#4b5563; font-size:16px; line-height:1.7;">
                    If you have questions or want to resubmit, please contact our support team.
                  </p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:25px 35px 35px;">
                  <a href="/" style="display:inline-block; background:#b91c1c; color:#ffffff; text-decoration:none; padding:13px 26px; border-radius:8px; font-size:15px; font-weight:600;">
                    Contact Support
                  </a>
                </td>
              </tr>

              <tr>
                <td align="center" style="background:#f9fafb; padding:18px 25px;">
                  <p style="margin:0; color:#6b7280; font-size:13px; line-height:1.5;">
                    This is an automated email. Please do not reply directly.
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

export default storyUnpublished;
