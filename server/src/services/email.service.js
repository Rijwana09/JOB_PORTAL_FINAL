import transporter from "../config/mail.js";
import ApiError from "../utils/ApiError.js";

import verifyEmailTemplate from "../templates/verifyEmail.js";
import forgotPasswordTemplate from "../templates/forgotPassword.js";
import welcomeEmailTemplate from "../templates/welcomeEmail.js";

class EmailService {
  async sendMail({ to, subject, html, text }) {
    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        text,
        html,
      });

      return info;
    } catch (error) {
        console.error("========== SMTP ERROR ==========");
        console.error(error);
        console.error("================================");

      throw new ApiError(
        500,
        "Failed to send email"
      );
    }
  }

  async sendVerificationEmail({
    email,
    name,
    verificationUrl,
  }) {
    const subject = "Verify your email";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2>Welcome to Job Portal</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          Thank you for registering.
          Please verify your email by clicking the button below.
        </p>

        <p style="margin:30px 0;">
          <a
            href="${verificationUrl}"
            style="
              background:#2563eb;
              color:white;
              padding:12px 24px;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Verify Email
          </a>
        </p>

        <p>
          If you didn't create this account,
          you can safely ignore this email.
        </p>
      </div>
    `;

    const text = `
Hello ${name},

Verify your email by visiting:

${verificationUrl}
`;

    return this.sendMail({
      to: email,
      subject,
      html,
      text,
    });
  }

  async sendForgotPasswordEmail({
    email,
    name,
    resetUrl,
  }) {
    const subject = "Reset your password";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
        <h2>Password Reset Request</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>
          We received a request to reset your password.
        </p>

        <p style="margin:30px 0;">
          <a
            href="${resetUrl}"
            style="
              background:#dc2626;
              color:white;
              padding:12px 24px;
              text-decoration:none;
              border-radius:6px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>
          If you didn't request a password reset,
          you can ignore this email.
        </p>
      </div>
    `;

    const text = `
Hello ${name},

Reset your password here:

${resetUrl}
`;

    return this.sendMail({
      to: email,
      subject,
      html,
      text,
    });
  }
}

export default new EmailService();