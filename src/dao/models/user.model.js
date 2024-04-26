import mongoose from "mongoose";
import { CartManagerMongo } from "../services/managers/CartManagerMongo.js";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: "user"
    }
});

userSchema.post('save', async function (doc, next) {
    try {
        if (doc.role === 'user' && !doc.cart) {
            const cartManager = new CartManagerMongo();
            const newCart = await cartManager.addCart();
            doc.cart = newCart._id;
            await doc.save(); 
        }
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("User", userSchema);

export default User;

