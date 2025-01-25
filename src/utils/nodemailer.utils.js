import nodemailer from "nodemailer";

// Nodemailer transporter configuration using Ethereal SMTP server
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'josie.wilkinson29@ethereal.email', // Replace with your Ethereal email
        pass: 'DB8M51UygESnGmmU5K' // Replace with your Ethereal password
    }
});

// Function to send the email with the auto-generated password
const sendPasswordEmail = async (userEmail, generatedPassword) => {
    try {
        const mailOptions = {
            from: 'josie.wilkinson29@ethereal.email', // Sender email
            to: userEmail, // Recipient email
            subject: 'Your Login Password',
            html: `
                <h1>Welcome to Our App!</h1>
                <p>Thank you for registering with our app.</p>
                <p>Your login password is: <strong>${generatedPassword}</strong></p>
                <p>For security, please log in and change your password immediately.</p>
            `,
        };

        // Send email using transporter
        const info = await transporter.sendMail(mailOptions);
        console.log("Password email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending password email:", error.message);
        throw new Error("Failed to send password email.");
    }
};

export { sendPasswordEmail };
