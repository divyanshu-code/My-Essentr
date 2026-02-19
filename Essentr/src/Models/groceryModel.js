import mongoose from 'mongoose';

const GrocerySchema = new mongoose.Schema({

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: [
            "Fruits and Vegetables",
            "Dairy & Eggs",
            "Rice, Atta & Grains",
            "Snacks & Biscuits",
            "Spices & Masalas",
            "Beverages & Drinks",
            "Household Essentials",
            "Instant & Packaged Food",
            "Baby & Pet Care"
        ],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,

    },
    unit1: {
        type: String,
        required: true,
        trim: true,
        enum: ['kg', 'L', 'piece', 'pack', 'g', 'ml']
    },
    image: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
});

const GroceryModel = mongoose.models.Grocery || mongoose.model('Grocery', GrocerySchema);

export default GroceryModel;