import { Schema, model } from "mongoose";
import {
  IStudent,
  // StudentMethods,
  // StudentModel,
} from "./student.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const studentSchema = new Schema<IStudent>(
  {
    id: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxlength: [20, "Password cann't be more then 20 characters"],
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be 'male', 'female', or 'others'",
      },
      required: [true, "Gender is required"],
    },
    dateOfBirth: { type: String },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
    },
    bloodGroup: { type: String, required: [true, "Blood group is required"] },

    profileImage: { type: String },
    isActive: {
      type: String,
      enum: {
        values: ["active", "blocked"],
        message: "Status must need be 'active' or 'blocked'",
      },
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);



//* Doc Middleware: Pre save middleware/Hooks: will work on create() save()
studentSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // refer Doc

  // Hashing pass to save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.BCRYPT_SALT_ROUNDS)
  );
  next();
});

// After the Doc save in DB action
studentSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

//* Query Middleware

studentSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre("findOne", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

//* Check aggregate Middleware
studentSchema.pre("aggregate", async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//* Creating a Custom static method

/* studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
}; */

//* Added Custom instance method
/* studentSchema.methods.isuserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });

  return existingUser;
}; */

export const Student = model<IStudent>("Student", studentSchema);
