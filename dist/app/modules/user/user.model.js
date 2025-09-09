"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(\+?88)?01[3-9]\d{8}$/.test(v); // Bangladeshi phone validation
            },
            message: "Please provide a valid phone number",
        },
    },
    address: {
        type: String,
        maxlength: [200, "Address cannot exceed 200 characters"],
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin", "staff"],
            message: "Role must be either user, admin, or staff",
        },
        default: "user",
    },
    status: {
        type: String,
        enum: {
            values: ["active", "inactive", "banned"],
            message: "Status must be active, inactive, or banned",
        },
        default: "active",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
