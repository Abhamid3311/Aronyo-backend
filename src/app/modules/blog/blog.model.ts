import { Schema, model } from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    image: {
      type: String,
      required: [true, "Blog image is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      minlength: [3, "Blog title must be at least 3 characters long"],
    },
    subTitle: {
      type: String,
      trim: true,
      maxlength: [200, "Sub-title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Blog description is required"],
      minlength: [20, "Blog description must be at least 20 characters long"],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => Array.isArray(v),
        message: "Tags must be an array of strings",
      },
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//  Pre-save hook to auto-generate slug from title
blogSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title.toLowerCase().replace(/ /g, "-");
  }
  next();
});

export const Blog = model<IBlog>("Blog", blogSchema);
