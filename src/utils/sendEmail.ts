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
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <h1>Verify your email</h1>
    <p>Here is your verfication token to verify your email address.</p>
    <h2>${token}</h2>
    
    `,
  };

  await transporter.sendMail(mailOptions);
};
