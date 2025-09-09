"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Category name must be at least 3 characters long"],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        maxlength: [500, "Description must not exceed 500 characters"],
    },
    image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
// 🔄 Pre-save hook to auto-generate slug from name
categorySchema.pre("save", function (next) {
    if (this.isModified("name") || !this.slug) {
        this.slug = this.name.toLowerCase().replace(/ /g, "-");
    }
    next();
});
categorySchema.index({ createdBy: 1 });
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
