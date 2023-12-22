import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import {OAuth2Client} from "google-auth-library";
dotenv.config();

export const sendMail = async (to, subject, html) => {
    try {
        // Tạo một transporter để gửi email
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Cấu hình các thông tin email
        const mailOptions = {
            from: process.env.EMAIL_ADMIN, // Địa chỉ email người gửi
            to, // Địa chỉ email người nhận
            subject, // Tiêu đề email
            html, // Nội dung email
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
