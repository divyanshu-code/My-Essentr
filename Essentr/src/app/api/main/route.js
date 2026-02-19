import { auth } from "@/auth";
import UserModel from "@/Models/userModel";
import { NextResponse } from "next/server";

export async function GET(req) {

    try {

        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await UserModel.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 401 });
        }
        
        return NextResponse.json(user, { status: 200 });

    } catch (err) {
          return NextResponse.json({ message: `Internal Server Error: ${err.message}` }, { status: 500 });
    }

}