import cron from 'node-cron';
import Restaurant from '../models/Restaurant.js'; // Adjust the import path
import Coupon from '../models/Coupon.js';

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        // Update restaurants with expiryDate less than or equal to the current date
        const result = await Restaurant.updateMany(
            { expiryDate: { $lte: now } },
            { $set: { isActive: false } }
        );
        console.log(`Updated ${result.modifiedCount} expired restaurants to inactive`);
        const couponResults=await Coupon.updateMany({
            expiryDate:{$lte:now}},{
                $set:{isActive:false}
            }
        );
        console.log(`Updated ${couponResults.modifiedCount} expired coupons to inactive`);
    } catch (error) {
        console.error('Error updating expired restaurants:', error);
    }
});

