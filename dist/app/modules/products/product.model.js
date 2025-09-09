"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Product title is required"],
        trim: true,
        minlength: [3, "Product title must be at least 3 characters long"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        minlength: [
            10,
            "Product description must be at least 10 characters long",
        ],
    },
    detailsDesc: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price must be a positive number"],
    },
    discountPrice: {
        type: Number,
        min: [0, "Discount price must be a positive number"],
        validate: {
            validator: function (value) {
                if (this.price == null)
                    return true;
                return value < this.price;
            },
            message: "Discount price must be less than the original price",
        },
    },
    category: {
        type: String,
        ref: "Category",
        required: [true, "Product category is required"],
    },
    brand: {
        type: String,
        trim: true,
    },
    images: {
        type: [String],
        required: [true, "At least one product image is required"],
        validate: {
            validator: (v) => v.length > 0,
            message: "At least one image must be provided",
        },
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
        min: [0, "Stock must be a non-negative number"],
    },
    tags: {
        type: [String],
        default: [],
    },
    ratings: {
        type: Number,
        default: 0,
        min: [0, "Ratings must be at least 0"],
        max: [5, "Ratings cannot exceed 5"],
    },
    numReviews: {
        type: Number,
        default: 0,
        min: [0, "Number of reviews must be 0 or more"],
    },
    size: {
        type: String,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
// 🔄 Pre-save hook to auto-generate slug from name
productSchema.pre("save", function (next) {
    if (this.isModified("title") || !this.slug) {
        this.slug = this.title.toLowerCase().replace(/ /g, "-");
    }
    next();
});
exports.Product = (0, mongoose_1.model)("Product", productSchema);
