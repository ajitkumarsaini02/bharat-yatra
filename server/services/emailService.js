import nodemailer from 'nodemailer';

/**
 * Send Real HTML OTP Email via Nodemailer SMTP
 */
export const sendOTPEmail = async (recipientEmail, otpCode) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  if (!emailUser || !emailPass) {
    console.log(`\n==============================================`);
    console.log(`✉️ [OTP CREATED FOR: ${recipientEmail}]`);
    console.log(`Verification Code: ${otpCode}`);
    console.log(`⚠️ SMTP credentials not set in server/.env (EMAIL_USER & EMAIL_PASS).`);
    console.log(`To receive real emails in inbox, set EMAIL_USER & EMAIL_PASS in server/.env`);
    console.log(`==============================================\n`);
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Bharat Yatra Security" <${emailUser}>`,
    to: recipientEmail,
    subject: `🔐 Your Bharat Yatra Verification Code is ${otpCode}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; background: #0A192F; border-radius: 20px; overflow: hidden; color: #f8fafc; border: 1px solid rgba(245, 158, 11, 0.3);">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 25px; text-align: center;">
          <h1 style="margin: 0; color: #0A192F; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">BHARAT YATRA</h1>
          <p style="margin: 5px 0 0 0; color: #0A192F; font-size: 12px; font-weight: 700; text-transform: uppercase;">Tourism & AI Travel Planner</p>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h2 style="margin-top: 0; color: #f8fafc; font-size: 20px;">Email OTP Verification</h2>
          <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
            Thank you for registering with Bharat Yatra! Use the 6-digit verification code below to activate your account:
          </p>
          <div style="margin: 25px 0; padding: 18px; background: rgba(245, 158, 11, 0.15); border: 2px dashed #f59e0b; border-radius: 16px; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #fbbf24;">
            ${otpCode}
          </div>
          <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
            This code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>
        <div style="background: rgba(15, 23, 42, 0.8); padding: 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); font-size: 11px; color: #64748b;">
          &copy; 2026 Bharat Yatra Tourism & Travel Platform. All rights reserved.
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`\n✅ [REAL EMAIL DISPATCH SUCCESS] Sent OTP ${otpCode} to ${recipientEmail} via SMTP!\n`);
  return true;
};
