import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    restaurantId: { //refers to the restaurant for which this coupon is valid
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    couponCode: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9]{5}$/    //means it should exactly contain a length 5 alpha numeric string
    },
    issueDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiryDate: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Current date + 1 day
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    isUsed: { //determines if the coupon has been used or not
        type: Boolean,
        default: false,
        required: true
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
