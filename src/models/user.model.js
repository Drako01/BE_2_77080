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
        required: false // Pasar a true si no uso la Stetegy de GitHub
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