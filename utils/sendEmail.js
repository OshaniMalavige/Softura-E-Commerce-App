import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

export default async function sendEmail(to, subject, code) {
    try {
        const templatePath = path.join(process.cwd(), "templates", "verificationcode.html");
        let emailTemplate = fs.readFileSync(templatePath, "utf8");

        emailTemplate = emailTemplate.replace("{{CODE}}", code);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: emailTemplate,
        });

        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
