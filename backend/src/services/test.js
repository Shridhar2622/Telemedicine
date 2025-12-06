require("dotenv").config({
    path: "../../.env"
});
const sendEmail = require("./emailService");

console.log(process.env.SMTP_EMAIL)

async function test() {
  try {
    await sendEmail(
      "213021222.shridhar@gmail.com",
      "Testing Transporter",
      "<h1>Your transporter works 🔥</h1>"
    );
    console.log("Mail sent!");
  } catch (err) {
    console.log("Mail failed:", err);
  }
}

test();
