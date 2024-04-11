import mongoose from "mongoose";


const usersCollection = "users";

const userSchema = new mongoose.Schema({
  name: String,
  lastname: String,
  email: String,
  age: Number,
  password: String,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", required: true },
  role: { type: String, default: "user" },
});

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;
