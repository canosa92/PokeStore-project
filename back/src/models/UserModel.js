const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        wishList: [{
            type: Schema.Types.ObjectId,
            ref: "Product"
        }],
        reviews: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            productName: {
                type: String,
                required: true,
            },
            productImage: {
                type: String,
                required: true,
            },
            productDescription: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }],
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
