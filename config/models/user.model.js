import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "seller", "admin"],
        default: "user"
    },
    githubid: {
        type: String,
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);