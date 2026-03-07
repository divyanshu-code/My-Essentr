import { auth } from "@/auth";
import connectDB from "@/Config/Db";
import DeliveryassignModel from "@/Models/deliveryassignModel";
import { NextResponse } from "next/server";

export async function GET(){
    
    try{

        await connectDB()

        const session = await auth();
    
        const deliveryboyId = session?.user?.id 

        const activeassignment = await DeliveryassignModel.findOne({assignCastedTo : deliveryboyId, status: "assigned"}).populate( {
             path: "currentOrderId",
             populate: {
                path: "address",
             }
        }).lean()

        if(!activeassignment){
            return NextResponse.json({active: false}, {status: 200})
        }

        return NextResponse.json({active: true, data: activeassignment}, {status: 200})

    }catch(err){
        console.log(err);
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}