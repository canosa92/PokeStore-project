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
        tokens:{ type: String } ,
        wishList: [{ type: ObjectId, ref: "Producto" }],
        comments: [
            {
                product: { type: ObjectId, ref: "Producto" },
                rating: { type: Number },
                comment: { type: String },
            }
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);

module.exports = User;
