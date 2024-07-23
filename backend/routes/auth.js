import express from 'express';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchUser from '../middleware/fetchUser.js';
import generatePassword from 'generate-password';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { PDFDocument, rgb } from 'pdf-lib'
import { google } from 'googleapis';
import dotenv from 'dotenv';
//make the necessary imports 

dotenv.config(); //to load environment variables from .env file to process.env

const router = express.Router();//set the router up
const JWT_SECRET = process.env.JWT_SECRET;
const generateOTP = () => {//function to generate a 6 digit otp;
    return Math.floor(100000 + Math.random() * 900000).toString();
}


//oAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Configure Mailgen with default theme and product info
let mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Huduki',
        link: 'https://mailgen.js/'
    }
});

// Route 1: Create a user (restaurant) using POST on "/api/auth/create-user". Login Not required.
router.post('/create-user', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('restaurantName').isLength({ min: 2 }).withMessage('Restaurant name must be at least 2 characters long'),
    body('contactPerson').isLength({ min: 2 }).withMessage('Contact person name must be at least 2 characters long'),
    body('contactPhone').isMobilePhone('any', { strictMode: false }).withMessage('Enter a valid contact phone number'),
    body('location').isLength({ min: 2 }).withMessage('Location must be provided'),
    body('registrationDuration').notEmpty(),
    body('restaurantId').notEmpty()
], async (req, res) => {
    let success = false;

    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const accessToken = await oAuth2Client.getAccessToken();//get access token
        const transporter = nodemailer.createTransport({ //create transporter object used to send the mail
            service: 'gmail', //since we are using gmail
            auth: { //mention required credentials
                type: 'OAuth2',
                user: process.env.USER_NAME,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        if (!accessToken) {
            throw new Error('Failed to obtain access token');
        }

        const { email, restaurantName, contactPerson, contactPhone, location, registrationDuration, restaurantId, amount } = req.body;
        //destructure required properties from the request body

        // Generate a strong password
        const generatedPassword = generatePassword.generate({
            length: 12, // Adjust length as needed
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true,
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt); // Use generatedPassword here

        // Create a new restaurant user with the hashed password
        const user = new User({ email, password: hashedPassword, restaurantName, contactPerson, contactPhone, location, registrationDuration, restaurantId });
        await user.save();

        // Generate JWT token
        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });



        //configure the mail you want to send.
        const mailOptions = {
            from: `Yours truly AB! <${process.env.USER_NAME}>`,
            to: email,
            subject: 'Your Huduki Account Details',
            text: `Congratulations! Your registration to Huduki is successful! Your password for ${email} is: ${generatedPassword}`,
            html: `<p>Congratulations!</p>
                   <p>Your registration to <strong>Huduki</strong> is successful!</p>
                   <p>Your password for <strong>${email}</strong> is: <strong>${generatedPassword}</strong></p>`
        }
        //Send mail using transporter object
        const result = await transporter.sendMail(mailOptions);

        // Create PDF for the bill
        const pdfDoc = await PDFDocument.create(); //create a PDF document
        const page = pdfDoc.addPage(); //add a page to the pdf document
        const { width, height } = page.getSize(); //get the dimensions of the page
        const fontSize = 18;

        page.drawText('Huduki Registration Bill', { //add this text at the specified position
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize + 10,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Date of Transaction: ${new Date().toLocaleDateString()}`, {//set date of transaction to the current date
            x: 50,
            y: height - 6 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Amount Transacted: ${amount / 100}`, { // Mention the amount transacted
            x: 50,
            y: height - 8 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        page.drawText(`Registration Duration: ${registrationDuration}`, {//Mention the registration duration
            x: 50,
            y: height - 10 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });
        let duration = registrationDuration === '6 months' ? 6 : 12;
        const currentDate = new Date();
        const validTillDate = new Date(currentDate);
        validTillDate.setMonth(currentDate.getMonth() + duration);
        // Handle month overflow by checking if the month has changed correctly
        if (validTillDate.getMonth() !== (currentDate.getMonth() + duration) % 12) {
            validTillDate.setDate(0); // Set to the last day of the previous month
        }
        page.drawText(`Valid Till: ${validTillDate.toLocaleDateString()}`, {
            x: 50,
            y: height - 12 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();//save the pdf document to a byte array which can then be used as an attachment in an email

        // Email options for the bill
        const mailOptionsBill = {
            from: `Yours truly AB! <${process.env.USER_NAME}>`,
            to: email,
            subject: 'Your Huduki Registration Bill',
            text: 'Please find attached your registration bill.',
            attachments: [{
                filename: 'Huduki_Registration_Bill.pdf',
                content: pdfBytes,
                contentType: 'application/pdf'
            }]
        };
        const result1 = await transporter.sendMail(mailOptionsBill);
        console.log(result1);
        success = true;
        res.cookie('token', authtoken, { httpOnly: true, secure: false, sameSite: 'Strict' });
        return res.json({ success, user, result, result1 });//send authtoken and success as true
    } catch (error) {//means some error occured
        console.error(error.message);
        return res.status(500).send({ success, error: error.response.data });
    }
});

// Route 2: Authenticate a restaurant user using POST on "/api/auth/login-restaurant"
router.post('/login-restaurant', [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').exists().withMessage('Password cannot be blank!')
], async (req, res) => {
    let success = false;

    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {//means validation failed
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Check if the user with the email exists
        let restaurant = await Restaurant.findOne({ email });
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success, error: 'Invalid credentials' });
        }
        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {//means password didn't match
            return res.status(404).json({ success, error: 'Invalid credentials' });
        }

        // Generate JWT token
        //means password matches so send the authtoken
        const data = { user: { id: user.id } };
        const authtoken = jwt.sign(data, JWT_SECRET, { expiresIn: '1m' });

        success = true;
        return res.json({ success, authtoken, id: user.restaurantId, data, isActive: restaurant.isActive });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ success, erro: 'Internal server error.' });
    }
});

// Route 3: Get logged in restaurant user details using POST on "/api/auth/get-restaurant"
router.post('/get-restaurant', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        return res.json({ success: true, user }); //will give you all user details
    } catch (err) {//means some error occured
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});
// Route 4: Send user a OTP if email is valid 
router.post('/send-otp', [body('email').isEmail().withMessage('Enter a valid email'),
body('email').notEmpty()
], async (req, res) => {
    let success = false;
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {//means validation failed
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { email } = req.body;//extract email from the request body


        const accessToken = await oAuth2Client.getAccessToken();//get access token
        const transporter = nodemailer.createTransport({ //create transporter object used to send the mail
            service: 'gmail', //since we are using gmail
            auth: { //mention required credentials
                type: 'OAuth2',
                user: process.env.USER_NAME,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        if (!accessToken) {
            console.log('Herere')
            throw new Error('Failed to obtain access token');
        }
        const otp = generateOTP();//generate the opt and send it
        // Hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt); // Use generatedPassword here

        let user = await User.findOne({ email });//find if user with that ID exists 

        if (!user)//if user with that email does not exist
            return res.status(404).send({ success: false, error: 'Invalid Email' });
        // Update user document with the hashed OTP
        user = await User.findOneAndUpdate(
            { email },
            { $set: { otp: hashedOtp } },
            { new: true }
        );

        //configure the mail you want to send.
        const mailOptions = {
            from: `Yours truly AB! <${process.env.USER_NAME}>`,
            to: email,
            subject: 'Reset Password OTP',
            text: `OTP for Huduki account password reset:${otp}`,
            html: `<p>OTP for resetting password of your Huduki account is :<strong>${otp}</strong></p>`
        }
        //Send mail using transporter object
        const result = await transporter.sendMail(mailOptions);
        return res.json({ success: true, result, user }); //send the opt
    } catch (err) {//means some error occured
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});

// Route 5: Send user a new password if email is valid and he clicks forgot password in Login.jsx using POST on "/api/auth/forgot-password". Login not required
router.post('/forgot-password', [body('email').isEmail().withMessage('Enter a valid email'),
body('email').notEmpty(),
body('otp').notEmpty()
], async (req, res) => {
    let success = false;
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {//means validation failed
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { email, otp } = req.body;//extract email from the request body

        const user = await User.findOne({ email });//check if user with that email exists or not
        if (!user)
            return res.status(404).send({ success: false, error: 'Invalid Credentials' });
        // Check if otp matches
        const isOtpMatch = await bcrypt.compare(otp, user.otp);
        if (!isOtpMatch) {//means password didn't match
            return res.status(404).json({ success, error: 'Invalid OTP' });
        }

        // Generate a new strong password
        const generatedPassword = generatePassword.generate({
            length: 12, // Adjust length as needed
            numbers: true,
            symbols: true,
            uppercase: true,
            excludeSimilarCharacters: true,
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt); // Use generatedPassword here


        const updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });//find the user with the given email , update his password and return the updated information
        console.log('Updated User:', updatedUser);
        const accessToken = await oAuth2Client.getAccessToken();//get access token
        const transporter = nodemailer.createTransport({ //create transporter object used to send the mail
            service: 'gmail', //since we are using gmail
            auth: { //mention required credentials
                type: 'OAuth2',
                user: process.env.USER_NAME,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        if (!accessToken) {
            throw new Error('Failed to obtain access token');
        }

        //configure the mail you want to send.
        const mailOptions = {
            from: `Yours truly AB! <${process.env.USER_NAME}>`,
            to: email,
            subject: 'Your New Huduki Password',
            text: `Congratulations! Password reset is successful! Your new password for ${email} is: ${generatedPassword}`,
            html: `<p>Congratulations!</p>
                   <p>Password reset is successful! </p>
                    <p>Your new password for <strong>${email}</strong> is: <strong>${generatedPassword}</strong></p>`
        }
        //Send mail using transporter object
        const result = await transporter.sendMail(mailOptions);
        return res.json({ success: true, updatedUser, result }); //will give you all updated user details

    }
    catch (err) {//means some error occured
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});
export default router;
//AIzaSyAkzD8dg5FdfKM52FLZwXXhLK8Rzw5yv8Q-map