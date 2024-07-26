import mongoose from "mongoose";
const uri="mongodb://localhost:27017/huduki";
//connect to mongo db
const connectToMongoDB = async () => {
    try {
        let res = await mongoose.connect(uri);
        console.log('Successfully connected to hudukiDB!' + res);
    } catch (err) {
        console.error(err);
    }
}
export default connectToMongoDB;