import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing other documents
        ref: 'Restaurant', // Reference to the Restaurant collection
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    amount: { //holds the amount to be paid
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now,
        required: true
    }

});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
