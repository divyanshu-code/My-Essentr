import dns from "dns";
import mongoose from 'mongoose';

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {

    if (cached.conn) {
        console.log("Using cached MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
            family: 4
        });
    }

    try {

        cached.conn = await cached.promise;
        console.log("MongoDB Connected");
        return cached.conn;

    } catch (err) {
        cached.promise = null;
        console.log("error connecting to MongoDB: ", err);
        throw err;
    }
};

export default connectDB;

// see we can not use mongoose.connect() directly because it creates multiple connections in development due to hot reloading in Next.js
// hot reloading means the file is reloaded multiple times, when the api is called so multiple connections are created which is not good for performance.

// from preventing multiple connections we create a global connection variable
// in react.js we can use globalThis but in next.js we use global

