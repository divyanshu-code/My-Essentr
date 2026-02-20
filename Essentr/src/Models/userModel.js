import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: false,
            minlength: 6,
        },
        mobile: {
            type: String,
            unique: true,
            sparse: true,         // Crucial: it Allows multiple null values
            required: false,
            trim: true,
        },
        role: {
            type: String,
            enum: ['user', 'deliveryboy', 'vendor'],
            default: 'user'
        },
        image: {
            type: String,
            required: false,
        },
        location: {                // it is used to store the user location for delivery partner because at first delivery partner is also a user.
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates :{
                type : [Number],
                default : [0 , 0]         // [ longitutde , latitude ]
            }
        },
        isAvailable : {
            type : Boolean,
            default : false
        },
        socketId : {
            type : String,
            default : null
        }
    },
    { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;