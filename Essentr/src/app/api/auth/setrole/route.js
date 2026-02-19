import { auth } from "@/auth";
import connectDB from "@/Config/Db";
import UserModel from "@/Models/userModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {

        await connectDB();

        const { role, mobile } = await request.json();

        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        const user = await UserModel.findOneAndUpdate(
            { email: session?.user?.email },
            { role, mobile },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (err) {
        console.log(err);

        if (err.code === 11000) {
                                 
            return NextResponse.json(
                { message: `This mobile is already linked to another account.` },
                { status: 400 }
            );
        }
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });

    }
}
