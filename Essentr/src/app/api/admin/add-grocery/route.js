import { auth } from "@/auth"
import upload from "@/Config/Cloudinary"
import connectDB from "@/Config/Db"
import GroceryModel from "@/Models/groceryModel"
import { NextResponse } from "next/server"

export async function POST(req) {

    try {
        await connectDB()

        const session = await auth()

        if (!session || session?.user?.role !== 'vendor') {
            return NextResponse.json({ message: "You are not vendor" }, { status: 400 })
        }

        const formData = await req.formData()

        const imageFile = formData.get("image");
        if (!imageFile || imageFile.size === 0) {
            return NextResponse.json({ message: "Image file is required" }, { status: 400 });
        }

        const imageurl = await upload(imageFile);

        if (!imageurl) {
            return NextResponse.json({ message: "Image upload to Cloudinary failed" }, { status: 500 });
        }

        const name = formData.get("name")
        const category = formData.get("category")
        const unit = formData.get("unit")
        const price = formData.get("price")
        const image = imageurl
        const unit1 = formData.get("unit1")
        const vendorId = session.user.id;

        const grocery = await GroceryModel.create({
            name,
            category,
            unit,
            price,
            image: image,
            unit1,
            vendor: vendorId
        })

        return NextResponse.json({ success: true, grocery: grocery }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: `Internal Server Error ${err.message}` }, { status: 500 })
    }
}