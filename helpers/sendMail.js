const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

module.exports.sendMail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,             // Your Gmail address from the .env file 
            pass: process.env.EMAIL_PASS,             // Your Gmail app password from the .env file
        }
    });

    // Configure the mailoptions object
    const mailOptions = {
        from: process.env.EMAIL_USER,               // Sender address from the .env file
        to: email,
        subject: subject,
        html: html
    };

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
}