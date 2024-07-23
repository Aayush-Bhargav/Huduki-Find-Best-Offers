import express from 'express';
import Restaurant from '../models/Restaurant.js';
import Coupon from '../models/Coupon.js';
import { body, validationResult } from 'express-validator';
import upload from '../middleware/upload.js';
import axios from 'axios';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { PDFDocument, rgb } from 'pdf-lib';
import crypto from 'crypto';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library'
import { prod_tt_sasportal } from 'googleapis/build/src/apis/prod_tt_sasportal/index.js';


const router = express.Router();

// Middleware for input validation
const validateRestaurantInput = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('restaurantName').isLength({ min: 2 }).withMessage('Restaurant name must be at least 2 characters long'),
    body('contactPerson').isLength({ min: 2 }).withMessage('Contact person name must be at least 2 characters long'),
    body('contactPhone').isMobilePhone('any', { strictMode: false }).withMessage('Enter a valid contact phone number'),
    body('registrationDuration').isIn(['6 months', '12 months']).withMessage('Invalid registration duration'),
    body('gstNumber').isLength({ min: 15, max: 15 }).withMessage('Enter a valid GST Number.'),
    body('lat').notEmpty().withMessage('Latitude is required'),
    body('lng').notEmpty().withMessage('Longitude is required')
];

//oAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
// Route 1: Fetch all  registered restaurants who are active
router.get('/all-restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true }); // Assuming isActive field indicates active restaurants
        let allRestaurants = [];//array to store all restaurants registered with huduki

        restaurants.forEach(restaurant => {
            allRestaurants.push(restaurant);
            //push each restaurant to our array
        });

        return res.json({ success: true, restaurants: allRestaurants });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});
// Route 2: Fetch all restaurants irrespective of active or not
router.get('/every-single-restaurant', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();

        let allRestaurants = [];//array to store all restaurants registered with huduki

        restaurants.forEach(restaurant => {
            allRestaurants.push(restaurant);
            //push each restaurant to our array
        });

        return res.json({ success: true, restaurants: allRestaurants });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});

// Route 3: Fetch all images uploaded by registered restaurants
router.get('/all-restaurant-images', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true }); // isActive field indicates active restaurants
        let allImages = [];

        restaurants.forEach(restaurant => {
            if (restaurant.image1) {//push image 1 if exists
                allImages.push({ restaurantName: restaurant.restaurantName, image: restaurant.image1, id: restaurant._id });
            }
            if (restaurant.image2) {//push image 2 if exists
                allImages.push({ restaurantName: restaurant.restaurantName, image: restaurant.image2, id: restaurant._id });
            }
        });
        return res.json({ success: true, images: allImages });//return success as true and array of all images
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});

// Route 4: Fetch all logos uploaded by registered restaurants
router.get('/all-restaurant-logos', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true }); // isActive field indicates active restaurants
        let allImages = [];

        restaurants.forEach(restaurant => {
            if (restaurant.logo) {//push logo if exists
                allImages.push({ restaurantName: restaurant.restaurantName, logo: restaurant.logo, id: restaurant._id });
            }

        });
        return res.json({ success: true, logos: allImages });//return success as true and array of all images
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ success: false, error: 'Internal server error.' });
    }
});


// Route 5: Add a new restaurant to Huduki. No login required
router.post('/create-user', upload.any(), validateRestaurantInput, async (req, res) => {
    // Validate the request using express-validator
    console.log('Location is:', req.body.location);
    console.log(typeof (req.body.location));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    //check if atleast one image has been uploaded
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'No images uploaded!' });
    }
    console.log("THis is new req.body", req.body);
    console.log('This is new req.files', req.files)
    // return res.status(200).send('hey')
    const {
        restaurantName,
        email,
        contactPhone,
        contactPerson,
        altContactPerson,
        altContactPhone,
        gstNumber,
        altEmail,
        registrationDuration,
        lat,
        lng,
        address,
        amount
    } = req.body;


    // Access the uploaded files
    const image1 = req.files.find(file => file.fieldname === 'image1');

    if (!image1) {
        return res.status(400).send('Image 1 is required.');
    }
    // Access the uploaded files
    const logo = req.files.find(file => file.fieldname === 'logo');

    if (!logo) {
        return res.status(400).send('Logo is required.');
    }
    const image2 = req.files.find(file => file.fieldname === 'image2');
    try {
        // Check if the restaurant with the email already exists
        let existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            return res.status(400).json({ success: false, error: 'Email is already taken.' });
        }

        // Create a new restaurant instance
        const newRestaurant = new Restaurant({
            restaurantName,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            email,
            contactPhone,
            contactPerson,
            altContactPerson: altContactPerson,
            altPhone: altContactPhone,
            gstNumber,
            altEmail,
            image1: image1.filename,
            logo: logo.filename,
            image2: image2 ? image2.filename : null,
            registrationDuration,
            address

        });


        // Save the new restaurant to MongoDB
        await newRestaurant.save();
        //find the restaurant
        let restaurant = await Restaurant.find({ email: newRestaurant.email });
        console.log('in emo:', restaurant)


        // Prepare data for the /api/auth/createUser request
        const userData = {
            email,
            restaurantName,
            contactPerson,
            contactPhone,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            registrationDuration,
            address,
            restaurantId: restaurant[0]._id,
            amount

        };

        // Make HTTP POST request to /api/auth/createUser
        const createUserResponse = await axios.post('http://localhost:5000/api/auth/create-user', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.status(200).json({ success: true, newRestaurant });
    } catch (err) {
        console.error('Error creating restaurant:', err);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});
// Route 6: To find all restaurants within a certain radius
router.get('/find-restaurants', async (req, res) => {
    const { lat, lng, radius } = req.query;
    console.log(lat, lng, radius);
    // Convert radius to meters (MongoDB expects radius in meters)
    const radiusInMeters = parseFloat(radius) * 1000; // Assuming radius is in kilometers

    try {
        // Perform a geospatial query using MongoDB's $geoNear
        const restaurants = await Restaurant.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    distanceField: "distance", //stores distance from the restaurant to the entered coordinates
                    maxDistance: radiusInMeters,
                    spherical: true //in order to find in a circular/spherical radius
                }
            },
            {
                $match: {
                    isActive: true // Filter only active restaurants
                }
            }
        ]);

        return res.status(200).json({ success: true, restaurants });
    } catch (error) {
        console.error('Error finding restaurants:', error);
        return res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

// Route 7: Update restaurant details including images and contact details
router.put('/update-restaurant/:id', upload.any(), validateRestaurantInput, async (req, res) => {
    const { id } = req.params;//get the id of the restaurant to update
    const {
        alternateContactPerson,
        alternatePhone,
        alternateEmail,
        image2Removed
    } = req.body;

    try {
        // Find the restaurant by ID
        // Access the uploaded files
        console.log('req.files', req.files)
        const image1 = req.files.find(file => file.fieldname === 'image1');
        console.log(image1);
        console.log('has image 2 been removed:', image2Removed)
        const image2 = req.files.find(file => file.fieldname === 'image2');
        console.log(image2);

        let restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ success: false, error: 'Restaurant not found' });
        }

        console.log('In edit restaurant found:', restaurant);
        // Update restaurant fields
        restaurant.altContactPerson = alternateContactPerson ? alternateContactPerson : '';
        restaurant.altPhone = alternatePhone ? alternatePhone : '';
        restaurant.altEmail = alternateEmail ? alternateEmail : '';
        restaurant.image1 = image1 ? image1.filename : restaurant.image1; //this is because image 1 is mandatory
        restaurant.image2 = image2 ? (image2.filename) : (image2Removed ? null : restaurant.image2); //image 2 is optional

        // Save updated restaurant details
        let newRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: restaurant }, // Fields to update
        );
        return res.json({ success: true, restaurant });//send success as true and the updated restaurant details
    } catch (err) {//else catch the error and send the message
        console.error(err.message);
        return res.status(500).send('Internal server error.');
    }
});
// Route 8: Renew membership. Login Required
router.post('/renew-membership', upload.any(), async (req, res) => {

    console.log("THis is new req.body", req.body);
    console.log('This is new req.files', req.files)
    const { //get the id of the restaurant whose membership has to be renewed and also the new registration duration
        id,
        registrationDuration,
        amount,
        email
    } = req.body;
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

        const existingRestaurant = await Restaurant.findById(id);//find the restaurant
        if (!existingRestaurant) { //if such a restaurant doesn't exist , return error
            return res.status(404).json({ success: false, error: 'Restaurant not found.' });
        }
        // Create PDF for the bill
        const pdfDoc = await PDFDocument.create(); //create a PDF document
        const page = pdfDoc.addPage(); //add a page to the pdf document
        const { width, height } = page.getSize(); //get the dimensions of the page
        const fontSize = 18;

        page.drawText('Huduki Membership Renewal Bill', { //add this text at the specified position
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
            subject: 'Your Huduki Membership Renewal Bill',
            text: 'Please find attached your membership renewal bill.',
            attachments: [{
                filename: 'Huduki_Registration_Bill.pdf',
                content: pdfBytes,
                contentType: 'application/pdf'
            }]
        };
        const result1 = await transporter.sendMail(mailOptionsBill);
        console.log(result1);
        let success = true;
        const now = new Date(); //calculate current time
        const expiryDate = new Date(now);
        expiryDate.setMonth(expiryDate.getMonth() + duration); //calculate expiry date

        const updatedRestaurant = await Restaurant.findByIdAndUpdate( //update details of the restaurant and set its status to being active again
            id,
            {
                registrationDate: now,
                registrationDuration,
                expiryDate,
                isActive: true
            },
            { new: true } // This option returns the updated document
        );

        res.status(200).json({ success: true, restaurant: updatedRestaurant });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }

});


// Helper function to generate random 5-character alphanumeric string
const generateCouponCode = () => {
    return crypto.randomBytes(3).toString('hex').slice(0, 5).toUpperCase();
};
const generateUniqueCouponCode = async () => { //function to generate a unique coupon code each time
    let uniqueCode = generateCouponCode();
    let couponExists = await Coupon.findOne({ couponCode: uniqueCode });

    while (couponExists) {
        uniqueCode = generateCouponCode();
        couponExists = await Coupon.findOne({ couponCode: uniqueCode });
    }

    return uniqueCode;
};

//Route 10: Generate a coupon
router.post('/generate-coupon', [body('email').isEmail().withMessage('Enter a valid email'), body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
], async (req, res) => {

    const { email, name, restaurantId } = req.body;
    const errors = validationResult(req);//check for invalid email or name and return errors if any
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() });
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

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Generate random unique coupon code

        const couponCode = await generateUniqueCouponCode();

        // Set expiry date to current date + 1 day
        const now = new Date();
        const expiryDate = new Date(now);
        expiryDate.setDate(now.getDate() + 1);

        // Create new coupon
        const newCoupon = new Coupon({
            email,
            name,
            restaurantId,
            couponCode,
            issueDate: now,
            expiryDate,
            isActive: true
        });

        await newCoupon.save();

        // Send email to the provided email address
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Coupon Code',
            text: `Use this coupon at ${restaurant.name} and get exciting discounts. 
                   Coupon issued at: ${now.toLocaleString()}
                   Coupon expires at: ${expiryDate.toLocaleString()}`,
            html: `<p>Use this coupon at <strong>${restaurant.restaurantName}</strong> and get exciting discounts.</p>
                   <p><strong>Coupon Code:</strong> ${couponCode}</p>
                   <p><strong>Coupon issued at:</strong> ${now.toLocaleString()}</p>
                   <p><strong>Coupon expires at:</strong> ${expiryDate.toLocaleString()}</p>`
        });
        return res.json({ success: true, couponCode });
    } catch (err) {
        console.error('Error generating coupon:', err);
        return res.status(500).send('Internal server error.');
    }
});

//Route 11: Verify validity of a coupon
router.post('/verify-coupon', async (req, res) => {
    const { id, couponCode, email } = req.body; // Get the ID and coupon code from the request body

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
        const now = new Date();
        if (!accessToken) {
            throw new Error('Failed to obtain access token');
        }
        // Find the coupon by restaurant ID and coupon code
        const coupon = await Coupon.findOne({ restaurantId: id, couponCode: couponCode });

        if (!coupon) { //means coupon could not be found
            return res.status(404).json({ error: 'Coupon not found' });
        }
        if (coupon.isUsed) { //means coupon has been used already
            return res.status(400).json({ error: 'Coupon has already been redeemed' });
        }
        if (coupon.expiryDate < now) { //means coupon has expired
            return res.status(400).json({ error: 'Coupon is not active as it has expired.' });
        }

        // Find and update the coupon
        const updatedCoupon = await Coupon.findOneAndUpdate(
            { restaurantId: id, couponCode: couponCode, isActive: true, isUsed: false }, // Query to find the coupon
            { $set: { isUsed: true, isActive: false } }, // Update fields( coupon already redeemed so cannot be used anymore)
            { new: true } // Return the updated document
        );
        // Send email to the provided restaurant email address telling them about the coupon redeeming
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Coupon redeemed through Huduki!',
            text: `Coupon ${couponCode} successfully redeemed by ${coupon.name}. 
                   Coupon redeemed at: ${now.toLocaleString()}`,
            html: `<p>Coupon successfully redeemed by<strong> ${coupon.name}</strong>.</p>
                   <p><strong>Coupon Code:</strong> ${couponCode}</p>
                   <p><strong>Coupon redeemed at:</strong> ${now.toLocaleString()}</p>`
        });
        // Send back the updated coupon document
        return res.status(200).json({ success: true, coupon });
    } catch (err) {
        console.error('Error verifying coupon:', err);
        return res.status(500).json({ error: 'Internal Server Error' })
    }
});
// Route 9: Delete a restaurant
router.delete('/delete-restaurant/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the restaurant by ID and delete it
        const restaurant = await Restaurant.findByIdAndDelete(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        return res.json({ message: 'Restaurant deleted successfully' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Internal server error.');
    }
});

export default router;
