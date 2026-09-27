import nodemailer from 'nodemailer';

let cachedTransporter = null;
let cachedTransporterKey = '';

function getTransporter(cleanUser, cleanPass, emailHost, emailPort) {
  const currentKey = `${cleanUser}:${cleanPass}:${emailHost}:${emailPort}`;
  if (cachedTransporter && cachedTransporterKey === currentKey) {
    return cachedTransporter;
  }
  cachedTransporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    pool: true, // Use persistent SMTP connection pool to eliminate socket handshake latency
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: cleanUser,
      pass: cleanPass
    }
  });
  cachedTransporterKey = currentKey;
  return cachedTransporter;
}

/**
 * Send Real HTML OTP Email via Nodemailer SMTP (or automatic Ethereal Test Inbox)
 */
export const sendOTPEmail = async (recipientEmail, otpCode) => {
  const cleanUser = (process.env.EMAIL_USER || '').trim();
  const cleanPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const emailPort = parseInt(process.env.EMAIL_PORT || '587');

  const isPlaceholderUser = !cleanUser || cleanUser.includes('your') || cleanUser === 'bharatyatra.official@gmail.com';
  const isPlaceholderPass = !cleanPass || cleanPass.includes('your_') || cleanPass === 'your_gmail_app_password';

  let transporter;
  let fromAddress;
  let isTestAccount = false;

  if (!isPlaceholderUser && !isPlaceholderPass) {
    // Custom Real Gmail / SMTP credentials with connection pooling
    transporter = getTransporter(cleanUser, cleanPass, emailHost, emailPort);
    fromAddress = process.env.EMAIL_FROM || `"Bharat Yatra Security" <${cleanUser}>`;
  } else {
    // Fallback: Generate Ethereal Test Inbox link on the fly for test preview
    isTestAccount = true;
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      fromAddress = `"Bharat Yatra Security" <${testAccount.user}>`;
    } catch (err) {
      console.log(`\n==============================================`);
      console.log(`✉️ [BHARAT YATRA REGISTRATION OTP]`);
      console.log(`Recipient Email: ${recipientEmail}`);
      console.log(`Verification Code: ${otpCode}`);
      console.log(`⚠️ SMTP Credentials not configured in server/.env`);
      console.log(`==============================================\n`);
      return { success: true, isTestAccount: true };
    }
  }

  const mailOptions = {
    from: fromAddress,
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

  try {
    const info = await transporter.sendMail(mailOptions);
    const testPreviewUrl = nodemailer.getTestMessageUrl(info);

    if (testPreviewUrl) {
      console.log(`\n==============================================`);
      console.log(`✉️ [TEST INBOX CREATED VIA ETHEREAL MAIL]`);
      console.log(`Recipient: ${recipientEmail}`);
      console.log(`Verification Code: ${otpCode}`);
      console.log(`🔗 Click to View Rendered Inbox Email:\n${testPreviewUrl}`);
      console.log(`==============================================\n`);
      return { success: true, previewUrl: testPreviewUrl, isTestAccount: true };
    }

    console.log(`\n✅ [REAL EMAIL DISPATCH SUCCESS] Sent OTP ${otpCode} to ${recipientEmail} via SMTP!\n`);
    return { success: true, isTestAccount: false };
  } catch (smtpErr) {
    console.log(`\n==============================================`);
    console.log(`❌ [SMTP DISPATCH ERROR] Could not send email to ${recipientEmail}`);
    console.log(`Error: ${smtpErr.message}`);
    console.log(`💡 FIX: Gmail requires a 16-character App Password!`);
    console.log(`1. Go to: https://myaccount.google.com/apppasswords`);
    console.log(`2. Generate App Password for 'Bharat Yatra'`);
    console.log(`3. Update server/.env: EMAIL_USER=your_email@gmail.com EMAIL_PASS=your_16_char_password`);
    console.log(`🔑 Verification Code generated for testing: ${otpCode}`);
    console.log(`==============================================\n`);
    return { success: false, error: smtpErr.message, fallbackCode: otpCode };
  }
};
