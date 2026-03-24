

const nodemailer = require("nodemailer");




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});


async function sendOTPEmail({ to, name, otp }) {
  const subject = "Your Beerantum Verification Code";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { background: #0A0A0F; margin: 0; padding: 0; font-family: 'Arial', sans-serif; color: #E0E0F0; }
    .wrapper { max-width: 480px; margin: 40px auto; background: #0F0F1A; border: 1px solid rgba(139,47,201,0.3); border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg,#8B2FC9,#CC00CC); padding: 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; color: white; font-family: monospace; letter-spacing: 0.15em; text-transform: uppercase; }
    .body { padding: 32px; }
    .otp-box { background: rgba(139,47,201,0.12); border: 2px dashed rgba(139,47,201,0.4); border-radius: 12px; text-align: center; padding: 24px; margin: 24px 0; }
    .otp-code { font-size: 42px; font-weight: bold; font-family: monospace; letter-spacing: 0.3em; color: #CC00CC; }
    .expiry { color: #9090B0; font-size: 13px; margin-top: 8px; }
    .footer { padding: 20px 32px; border-top: 1px solid rgba(139,47,201,0.15); text-align: center; color: #9090B0; font-size: 12px; }
    p { line-height: 1.6; color: #9090B0; }
    strong { color: #E0E0F0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⚛ Beerantum</h1>
    </div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Here is your one-time verification code to access the Beerantum admin panel:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
        <p class="expiry">⏱ Expires in <strong>10 minutes</strong></p>
      </div>
      <p>Enter this code on the verification screen. Do not share it with anyone.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Beerantum Quantum Computing Team
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Beerantum" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}


async function sendWelcomeEmail({ to, name, role }) {
  await transporter.sendMail({
    from: `"Beerantum" <${process.env.SMTP_USER}>`,
    to,
    subject: "You now have access to Beerantum Admin Panel",
    html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:40px auto;background:#0F0F1A;border:1px solid rgba(139,47,201,0.3);border-radius:16px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#8B2FC9,#CC00CC);padding:32px;text-align:center;">
    <h1 style="margin:0;font-size:22px;color:white;font-family:monospace;letter-spacing:0.15em;text-transform:uppercase;">⚛ Beerantum</h1>
  </div>
  <div style="padding:32px;color:#9090B0;line-height:1.6;">
    <p>Hi <strong style="color:#E0E0F0">${name}</strong>,</p>
    <p>The Beerantum admin has granted you <strong style="color:#CC00CC">${role}</strong> access to the admin panel.</p>
    <p>You can now log in at: <a href="${process.env.FRONTEND_URL}/login" style="color:#8B2FC9;">${process.env.FRONTEND_URL}/login</a></p>
    <p>As an <strong style="color:#E0E0F0">${role}</strong> you can: ${role === "admin" ? "manage all content, delete items, and manage user access" : "add and edit team members, events, partners, and view contact messages"}.</p>
  </div>
  <div style="padding:20px 32px;border-top:1px solid rgba(139,47,201,0.15);text-align:center;color:#9090B0;font-size:12px;">
    © ${new Date().getFullYear()} Beerantum Quantum Computing Team
  </div>
</div>`,
  });
}

module.exports = { sendOTPEmail, sendWelcomeEmail };