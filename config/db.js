import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MONGODB CONNECTED: ${conn.connection.host}, db: ${conn.connection.name}`
    );
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
