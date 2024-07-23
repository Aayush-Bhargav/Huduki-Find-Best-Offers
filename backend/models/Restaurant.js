import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    restaurantName: {//name of the restaurant
        type: String,
        required: [true, "Restaurant name is required"]
    },
    // lat: {//stores latitude
    //      type: Number, 
    //      required: true 
    // },
    // lng: {//stores longitude
    //      type: Number,
    //       required: true 
    // },
    gstNumber: {//stores gst number of the restaurant
        type: String,
        required: [true, "GST number is required"]
    },
    contactPerson: {//to store the contact person's name
        type: String,
        required: [true, "Contact person name is required"]
    },
    altContactPerson: {//to store alternate contact person's name , not mandatory
        type: String
    },
    contactPhone: {//stores the phone number of the contact person
        type: String,
        required: [true, "Contact phone number is required"]
    },
    altPhone: {//stores phone number of alternate contact person, not mandatory
        type: String
    },
    email: {//to store email 
        type: String,
        required: [true, "Email is required"]
    },
    altEmail: {
        type: String
    },
    image1: {//discount image needs to be put here
        type: String,
        required: [true, "Image 1 is required"]
    },
    logo: {//logo needs to be put here
        type: String,
        required: [true, "Restaurant Logo is required"]
    },
    image2: {
        type: String
    },
    registrationDuration: {//to store the duration of the registration
        type: String,
        enum: ['6 months', '12 months'],
        required: [true, "Registration duration is required"]
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
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
    address: {
        type: String
    },
    expiryDate: {
        type: Date
    },
});

restaurantSchema.index({ location: '2dsphere' }); // Ensure the geospatial index is set correctly
// Create a 2D sphere index on lat and lng fields
// Middleware to set the expiry date
restaurantSchema.pre('save', function (next) {//runs before saving the document thus setting the expiry date as well
    if (this.isNew) { //'this' refers to the document being saved.
        const duration = this.registrationDuration === '6 months' ? 6 : 12;
        this.expiryDate = new Date(this.registrationDate);//start with the registrationDate
        this.expiryDate.setMonth(this.expiryDate.getMonth() + duration);//set expiry date by adding duration to get the actual expiry date.
    }
    next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);//create a mongoose model

export default Restaurant;//and export it.
