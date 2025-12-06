const nodemailer=require("nodemailer")


async function sendEmail(to,subject,html){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    })

    const mailOptions={
        from: process.env.SMTP_EMAIL,
        to,
        subject,
        html
    }

    return transporter.sendMail(mailOptions)


}

module.exports= sendEmail