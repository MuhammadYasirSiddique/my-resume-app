import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: number) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"My Resume" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - My Resume",
    html: `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <!-- Header -->
        <tr>
          <td align="center" bgcolor="#4CAF50" style="padding: 40px 0 30px 0;">
            <h1 style="color: white; font-size: 28px; margin: 0;">Verify Your Email Address</h1>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td bgcolor="#ffffff" style="padding: 40px 30px; border-radius: 10px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0;">Hello,</p>
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Thank you for signing up with <strong>My Resume</strong>! To complete your registration, please verify your email by entering the code below:
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 30px 0;">
                  <p style="font-size: 22px; color: #333333; font-weight: bold; margin: 0;">Your Verification Code:</p>
                  <p style="font-size: 36px; color: #4CAF50; font-weight: bold; margin: 10px 0;">${token}</p>
                </td>
              </tr>
            </table>

            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Enter this code in the verification field to confirm your email and get started.
            </p>
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0;">Thank you for joining us! We’re excited to have you on board.</p>
          </td>
        </tr>

        <!-- Footer Note -->
        <tr>
          <td bgcolor="#ffffff" style="padding: 20px 30px; color: #555555; font-size: 14px; line-height: 1.5;">
            <p>If you didn’t sign up for this account, you can safely ignore this email. No further action is required.</p>
            <p>Cheers,<br><strong>The My Resume Team</strong></p>
            <hr style="border: none; border-top: 1px solid #dddddd;">
            <p style="font-size: 12px; color: #999999;">You are receiving this email because you recently registered at <strong>My Resume</strong>. If you have any concerns, please <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">contact support</a>.</p>
          </td>
        </tr>

        <!-- Support Section -->
        <tr>
          <td bgcolor="#555555" style="padding: 30px; text-align: center; color: #ffffff;">
            <p style="margin: 0; font-size: 14px;">Need help? Feel free to <a href="mailto:support@example.com" style="color: #ffffff; text-decoration: underline;">reach out to our support team</a>.</p>
          </td>
        </tr>
      </table>
    </body>
    `,
  };

  await transporter.sendMail(mailOptions);
};
