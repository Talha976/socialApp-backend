const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const SECRET_KEY = process.env.SECRET_KEY;

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUser = await User.findOne({ email });

        if (!checkUser) {
            return res.status(404).json({ message: 'Email Not Found' });
        }

        const token = jwt.sign({ id: checkUser._id }, SECRET_KEY, { expiresIn: '1d' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false, 
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS,
            },
        });

        const mailOptions = {
            from: process.env.USER_EMAIL,  
            to: email,
            subject: 'Reset Password',
            html: `<p>Click the link below to reset your password:</p>
                   <a href="http://localhost:3000/reset-password/${checkUser._id}/${token}" style="background-color: #007bff; color: white; padding: 10px; text-decoration: none; border-radius: 5px;">Reset Password</a>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'Email sent successfully' });
            }
        });

    } catch (error) {
        console.error('Error in forgetPassword:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { id, token } = req.params;
        
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Error with token' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: 'Error Updating' });
            }else{
            return res.status(200).json({ message: 'Password updated successfully' });
            }

        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { forgetPassword, resetPassword };
