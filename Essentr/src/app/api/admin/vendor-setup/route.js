import connectDB from "@/Config/Db";
import VendorModel from "@/Models/vendorModel";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {
        await connectDB();
        const data = await request.json();

        const { userId, ...formData } = data;

        const existingVendor = await VendorModel.findOne({ userId });
        if (existingVendor) {
            return NextResponse.json({ message: "Vendor profile already exists" }, { status: 400 });
        }

        const newVendor = await VendorModel.findOneAndUpdate({
            userId: userId
        }, {
            ...formData
        },
            { new: true, upsert: true }  // upsert means if no document matches the query criteria, create a new document
        );

        return NextResponse.json({
            success: true,
            message: "Vendor profile created successfully",
            vendor: newVendor
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}