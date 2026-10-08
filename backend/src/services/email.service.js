import nodemailer from "nodemailer"
import { config } from "../config/config.js"

let transporter = null
let lastUser = null
let lastPass = null

function getTransporter() {
  const currentUser = (config.smtp.user || process.env.SMTP_USER || "").trim()
  const currentPass = (config.smtp.pass || process.env.SMTP_PASS || "").replace(/\s+/g, "")

  if (transporter && lastUser === currentUser && lastPass === currentPass) {
    return transporter
  }

  if (currentUser && currentPass) {
    try {
      if (!config.smtp.host && (currentUser.includes("@gmail.com") || process.env.SMTP_SERVICE === "gmail")) {
        transporter = nodemailer.createTransport({
          service: "gmail",
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 8000,
          auth: {
            user: currentUser,
            pass: currentPass,
          },
        })
        console.log(`[EmailService] Configured pooled Gmail service transport for ${currentUser}`)
      } else {
        transporter = nodemailer.createTransport({
          host: config.smtp.host || "smtp.gmail.com",
          port: config.smtp.port || 587,
          secure: config.smtp.secure || false,
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 8000,
          auth: {
            user: currentUser,
            pass: currentPass,
          },
        })
        console.log(`[EmailService] Configured pooled SMTP transport with host ${config.smtp.host || "smtp.gmail.com"}`)
      }
      lastUser = currentUser
      lastPass = currentPass
    } catch (err) {
      console.error("[EmailService] Failed to create SMTP transporter:", err)
      transporter = null
    }
  } else {
    transporter = null
  }

  return transporter
}

export async function sendVerificationEmail(email, username, verificationCode) {
  const mailTransporter = getTransporter()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Kernel0X CTF Verification</title>
      <style>
        body { margin: 0; padding: 0; background-color: #0a0d0a; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
        .header { border-bottom: 2px solid #9dff1f; padding-bottom: 16px; margin-bottom: 24px; }
        .title { color: #9dff1f; font-size: 28px; font-weight: 800; letter-spacing: 2px; margin: 0; }
        .subtitle { color: #888888; font-family: monospace; font-size: 13px; margin-top: 4px; }
        .content { background-color: #10140f; border: 1px solid #1c231d; padding: 28px; border-radius: 4px; }
        .greeting { font-size: 18px; margin-bottom: 16px; }
        .desc { color: #cccccc; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
        .code-box { background: #000000; border: 2px dashed #9dff1f; text-align: center; padding: 20px; margin: 24px 0; border-radius: 4px; }
        .code-label { color: #9dff1f; font-family: monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
        .code { color: #ffffff; font-family: monospace; font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 0; }
        .notice { color: #888888; font-size: 12px; margin-top: 24px; line-height: 1.5; font-family: monospace; }
        .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #555555; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">KERNEL0X CTF</h1>
          <div class="subtitle">&gt; ACCESS_VERIFICATION_PROTOCOL.SYS</div>
        </div>
        <div class="content">
          <div class="greeting">Greetings, Operative <strong>${username}</strong>!</div>
          <div class="desc">
            You have initiated registration for the <strong>Kernel0X CTF Event</strong>. 
            To activate your participant credentials and enter the competition portal, please enter the 6-digit verification code below:
          </div>
          <div class="code-box">
            <div class="code-label">// SECURITY VERIFICATION CODE //</div>
            <div class="code">${verificationCode}</div>
          </div>
          <div class="notice">
            * This verification code will expire in 15 minutes.<br />
            * If you did not request this verification, please disregard this email.
          </div>
        </div>
        <div class="footer">
          KERNEL0X CYBERSECURITY CTF • SLIIT MALABE CAMPUS<br />
          SECURE TRANSMISSION // LEVEL 01 ACCESS
        </div>
      </div>
    </body>
    </html>
  `

  const textContent = `
[KERNEL0X CTF] Participant Email Verification
Greetings, Operative ${username}!

Your 6-digit verification code to join Kernel0X CTF is:
${verificationCode}

This code expires in 15 minutes.
Enter this code in the verification screen to activate your account and enter the CTF Event Platform.

-- Kernel0X CTF Team
  `.trim()

  if (!mailTransporter) {
    console.warn(`[EmailService] ⚠️ SMTP not configured! To deliver real emails to ${email}, please provide SMTP_USER and SMTP_PASS in backend/.env`)
    if (config.nodeEnv === "development") {
      console.log("\n" + "=".repeat(65))
      console.log("  >>> [DEV MODE] EMAIL VERIFICATION CODE DISPATCHED <<<")
      console.log("=".repeat(65))
      console.log(`  RECIPIENT : ${email} (${username})`)
      console.log(`  CODE      : ${verificationCode}`)
      console.log("  NOTICE    : SMTP credentials not configured in backend/.env")
      console.log("=".repeat(65) + "\n")
      return { success: true, method: "dev_fallback", devFallback: true, devCode: verificationCode }
    }
    return {
      success: false,
      error: "Email delivery failed: SMTP credentials are not set in backend/.env. Please configure your email sender to deliver verification codes to real email inboxes.",
    }
  }

  try {
    const sender = config.smtp.from.includes("<") ? config.smtp.from : `Kernel0X CTF <${config.smtp.user}>`
    const info = await mailTransporter.sendMail({
      from: sender,
      to: email,
      subject: `[Kernel0X CTF] Your Verification Code: ${verificationCode}`,
      text: textContent,
      html: htmlContent,
    })
    console.log(`[EmailService] Verification email successfully sent to ${email} (MessageId: ${info.messageId})`)
    return { success: true, method: "smtp", messageId: info.messageId }
  } catch (err) {
    console.error(`[EmailService] SMTP error sending to ${email}:`, err.message)
    if (config.nodeEnv === "development") {
      console.log("\n" + "=".repeat(65))
      console.log("  >>> [DEV MODE] EMAIL VERIFICATION CODE DISPATCHED <<<")
      console.log("=".repeat(65))
      console.log(`  RECIPIENT : ${email} (${username})`)
      console.log(`  CODE      : ${verificationCode}`)
      console.log(`  NOTICE    : SMTP Delivery Failed (${err.message})`)
      console.log("  REASON    : Invalid Google App Password or SMTP credentials in backend/.env")
      console.log("=".repeat(65) + "\n")
      return { success: true, method: "dev_fallback", devFallback: true, devCode: verificationCode, warning: err.message }
    }
    return {
      success: false,
      error: `Failed to deliver email to ${email}: ${err.message}. Please check your SMTP credentials in backend/.env.`,
    }
  }
}
