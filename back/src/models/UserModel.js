const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true,
        },
        email:{
            type :String ,
            required: true
        },
        username:{
            type: String,
            unique: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
        },
        tokens: { type: String },
        wishList: [{ type: ObjectId, ref: "Product" }],
        comments: [
            {
                product: { type: ObjectId, ref: "Product" },
                rating: { type: Number },
                comment: { type: String },
            }
        ],
    },
    { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
