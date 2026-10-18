const nodemailer = require("nodemailer");

/**
 * Send email using Brevo (Sendinblue) HTTP API
 * Best for production deployments on Render/AWS/Vercel:
 * - Render never blocks outbound HTTPS traffic (port 443)
 * - Free tier: 300 emails/day
 * - Does NOT require custom domain verification (can send using verified personal Gmail)
 */
async function sendViaBrevo(to, subject, html) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_EMAIL || "riderknight6789@gmail.com";
  const senderName = process.env.EMAIL_FROM_NAME || "Telemedicine Support";

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Brevo HTTP API error (${response.status}): ${errorData.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Send email using Resend HTTP API
 * Excellent modern developer API:
 * - Free tier: 3,000 emails/month (100/day)
 * - Uses HTTPS REST API over port 443 (never blocked by Render)
 */
async function sendViaResend(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Telemedicine <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: subject,
      html: html
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Resend HTTP API error (${response.status}): ${errorData.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Shared Nodemailer transporter instance with connection pooling and timeouts
 */
let smtpTransporter = null;

function getSmtpTransporter() {
  if (smtpTransporter) return smtpTransporter;

  const email = process.env.SMTP_EMAIL;
  // Google App Passwords often have spaces ("abcd efgh ijkl mnop") - remove spaces
  const pass = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, "") : "";

  smtpTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "false" ? false : true,
    auth: {
      user: email,
      pass: pass
    },
    // Prevent requests hanging on cloud hosts when SMTP ports are throttled/blocked
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });

  return smtpTransporter;
}

/**
 * Send email via Nodemailer SMTP (standard for local development)
 */
async function sendViaNodemailer(to, subject, html) {
  const transporter = getSmtpTransporter();
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Telemedicine" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Universal email dispatcher
 * Prioritizes HTTPS-based APIs (Brevo / Resend) for cloud hosts like Render,
 * and falls back to Nodemailer SMTP for local development.
 */
async function sendEmail(to, subject, html) {
  // 1. Brevo HTTP API (ideal for Render & free tier without custom domain)
  if (process.env.BREVO_API_KEY) {
    return sendViaBrevo(to, subject, html);
  }

  // 2. Resend HTTP API
  if (process.env.RESEND_API_KEY) {
    return sendViaResend(to, subject, html);
  }

  // 3. Fallback to Nodemailer SMTP (Gmail app password)
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    return sendViaNodemailer(to, subject, html);
  }

  throw new Error(
    "No email service configured. Please provide BREVO_API_KEY, RESEND_API_KEY, or SMTP_EMAIL & SMTP_PASSWORD in environment variables."
  );
}

module.exports = sendEmail;