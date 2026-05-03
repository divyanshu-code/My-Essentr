import mongoose from "mongoose";

const masterOrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    childOrders: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order' 
    }],
    shippingAddress: {
        name: String,
        mobile: String,
        address: String,
        pincode: String,
        state: String,
        latitude: Number,
        longitude: Number
    },
    paymentMethod: { 
        type: String, 
        enum: ["cod", "razorpay"], 
        default: "cod" 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Out for delivery", "Delivered" , "Cancelled"],
        default: "Pending" 
    },
    changeOption: { 
        type: String,
        enum: ["hasChange", "needChange"],
        default: "hasChange" 
    },
    change: {
        customerGiveamt: Number,
        deliveryReturnamt: Number
    },
    assignedDeliverypartner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    isPaid: { 
        type: Boolean, 
        default: false 
    },
    orderstatus:{
        type: String,
        enum: ["ready", "picked", "delivered"],
        default: "ready"
    }
}, { timestamps: true });

const MasterOrderModel = mongoose.models.MasterOrder || mongoose.model('MasterOrder', masterOrderSchema);
export default MasterOrderModel;