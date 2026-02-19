import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true,
    },
    secondaryMobile: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit number'],
    },
    address: {
        type: String,
        required: [true, 'Store address is required'],
    },
    status: {
        type: Boolean,
        default: false,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
})

const VendorModel = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);

export default VendorModel ;