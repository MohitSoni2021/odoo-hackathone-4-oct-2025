const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Use service: 'gmail' which is more robust for Gmail accounts
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: (process.env.EMAIL_USERNAME || '').trim(),
      pass: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.replace(/['"]+/g, '').trim() : '',
    },
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('[EmailService] Transporter configuration error:', error);
    } else {
      console.log('[EmailService] Transporter is ready to deliver messages');
    }
  });

  return transporter;
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #0F172A;
            margin: 0;
            padding: 0;
            background-color: #F1F5F9;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #1E293B;
            padding: 32px;
            text-align: center;
        }
        .logo {
            color: #FFFFFF;
            font-size: 24px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
        }
        .footer {
            background-color: #F8FAFC;
            padding: 24px;
            text-align: center;
            color: #64748B;
            font-size: 12px;
            border-top: 1px solid #E2E8F0;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #FF6B3D;
            color: #FFFFFF !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 24px;
        }
        .otp-container {
            background-color: #F8FAFC;
            border: 2px dashed #E2E8F0;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 24px 0;
        }
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #FF6B3D;
            letter-spacing: 4px;
        }
        h1 { color: #0F172A; font-size: 24px; margin-bottom: 16px; }
        p { color: #64748B; margin-bottom: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">InTrack</div>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} InTrack. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

exports.sendVerificationEmail = async (user, otp) => {
  const transporter = createTransporter();
  
  const content = `
    <h1>Verify Your Account</h1>
    <p>Welcome to InTrack, ${user.firstName}! Please use the following code to verify your account:</p>
    <div class="otp-container">
        <div class="otp-code">${otp}</div>
    </div>
    <p>This code is valid for 10 minutes.</p>
    <p>If you didn't create an account, please ignore this email.</p>
    <p style="margin-top: 32px;">Best regards,<br>The InTrack Team</p>
  `;

  try {
    console.log(`[EmailService] Attempting to send verification email to: ${user.email}`);
    await transporter.sendMail({
      from: `"InTrack" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Verify your InTrack account',
      html: baseTemplate(content),
    });
    console.log(`[EmailService] Verification email sent successfully to: ${user.email}`);
  } catch (error) {
    console.error(`[EmailService] Failed to send verification email to ${user.email}:`, error);
    throw new Error('Notification delivery failure: Verification email could not be dispatched.');
  }
};

exports.sendPasswordResetOTP = async (user, otp) => {
  const transporter = createTransporter();

  const content = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Please use the following code to proceed:</p>
    <div class="otp-container">
        <div class="otp-code">${otp}</div>
    </div>
    <p>This code is valid for only 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <p style="margin-top: 32px;">Best regards,<br>The InTrack Team</p>
  `;

  try {
    console.log(`[EmailService] Attempting to send password reset OTP to: ${user.email}`);
    await transporter.sendMail({
      from: `"InTrack" <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: 'Your Password Reset Code',
      html: baseTemplate(content),
    });
    console.log(`[EmailService] Password reset email sent successfully to: ${user.email}`);
  } catch (error) {
    console.error(`[EmailService] Failed to send password reset email to ${user.email}:`, error);
    throw new Error('Notification delivery failure: Reset code could not be dispatched.');
  }
};
