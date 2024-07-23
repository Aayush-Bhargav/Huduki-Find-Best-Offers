import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId type for referencing other documents
        ref: 'Restaurant', // Reference to the Restaurant collection
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // GeoJSON type
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // Array of [longitude, latitude]
            required: true
        }
    },
    otp: {
        type: String,
        index: { expires: '5m' } // Set TTL index to expire documents after 5 minutes
    }
    // Add more fields as needed for your application
});

const User = mongoose.model('User', userSchema);

export default User;
