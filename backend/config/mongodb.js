import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("database connected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
