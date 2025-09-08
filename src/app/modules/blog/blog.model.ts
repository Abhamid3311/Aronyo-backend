import { Schema, model } from "mongoose";
import { IBlog } from "./blog.interface";

const blogSchema = new Schema<IBlog>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    slug: { type: String, unique: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// 🔄 Pre-save hook to auto-generate slug from name
blogSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title.toLowerCase().replace(/ /g, "-");
  }
  next();
});

export const Blog = model<IBlog>("Blog", blogSchema);
