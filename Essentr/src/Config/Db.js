import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ;

if(!MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables");
}

// see we can not use mongoose.connect() directly because it creates multiple connections in development due to hot reloading in Next.js
// hot reloading means the file is reloaded multiple times, when the api is called so multiple connections are created which is not good for performance. 

// from preventing multiple connections we create a global connection variable
// in react.js we can use globalThis but in next.js we use global


let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
            return mongoose.connection;
        });
    }

    try{
        const conn = await cached.promise;
        return conn;
    }catch(err){
        console.log(err);
        throw err;
    }
};

export default connectDB;