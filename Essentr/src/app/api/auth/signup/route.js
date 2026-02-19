import connectDB from "@/Config/Db";
import UserModel from "@/Models/userModel";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function POST(req) {
     try{

        await connectDB();

        const { name, email, password } = await req.json();

        const existuser = await UserModel.findOne({ email });

        if (existuser) {
            return NextResponse.json( { message: "User already exists" }, { status: 400 } );
        }
        
        if(password.length < 6){
            return NextResponse.json( { message: "Password must be at least 6 characters long" }, { status: 400 } );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword
        });

        return NextResponse.json( { success: true, user: newUser }, { status: 200 });
     } catch (error) {

        return NextResponse.json( { message: `Internal Server Error ${error.message}` }, { status: 500 } );
     }
}