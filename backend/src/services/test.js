const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env")
});
const sendEmail = require("./emailService");

console.log("Configured email:", process.env.SMTP_EMAIL || process.env.BREVO_SENDER_EMAIL || "None");
console.log("Active service provider:", 
  process.env.BREVO_API_KEY ? "Brevo (HTTP API)" : 
  process.env.RESEND_API_KEY ? "Resend (HTTP API)" : 
  process.env.SMTP_EMAIL ? "Nodemailer (SMTP)" : "None"
);

async function test() {
  try {
    const testRecipient = process.env.SMTP_EMAIL || "test@example.com";
    console.log(`Sending test email to ${testRecipient}...`);
    const result = await sendEmail(
      testRecipient,
      "Telemedicine Test Email",
      "<h1>Your email service is working perfectly! 🔥</h1><p>Sent from Telemedicine Platform.</p>"
    );
    console.log("✅ Email sent successfully! Result:", result);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
}

test();
