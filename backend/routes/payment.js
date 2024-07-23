import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Payment from '../models/Payment.js';


dotenv.config();//configure the .env file

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
//ROUTE 1: To create a new payment order on RazorPay
router.post('/orders', async (req, res) => {
    const { amount, currency, receipt } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paise(As I sent the amount in rupees from the frontend)
            currency,
            receipt //unique identifier for the payment
        };
        // Create a new order using Razorpay instance
        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(500).json({ error: "Could not create order!" });
        }
        // Respond with the created order details
        return res.status(200).json(order);
    } catch (error) {
        // Handle errors if creating order fails
        console.error('Error creating order:', error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
});
//ROUTE 2: To verify the payment response received from RazorPay
router.post('/verify', async (req, res) => {
    console.log('Hey in verfication now')
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    //razorpay_signature is what is returned by the payment
    //we need to match it with a signature that we generate to confirm the payment.

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        console.log('Signature matched');

        return res.status(200).json({ success: true });
    } else {
        console.log('Signature not matched')
        return res.status(400).json({ success: false });
    }
});
router.post('/payment-details', async (req, res) => {
    // Save payment details to MongoDB using Mongoose
    console.log('In payment details')
    try {
        console.log(req.body);
        const payment = new Payment({
            restaurantId: req.body.restaurantId, // pass restaurantId in req.body
            amount: req.body.amount / 100, // Convert back to rupees from paise,
            paymentId: req.body.razorpay_payment_id,
            orderId: req.body.razorpay_order_id,
            signature: req.body.razorpay_signature
        });

        // Save the payment object
        await payment.save();
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err, 'occured while saving payment info')
        return res.status(200).json({ success: false });
    }
})
export default router;
