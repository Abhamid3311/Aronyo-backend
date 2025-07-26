// import { Model } from "mongoose";

export interface IStudent {
  id: string;
  password: string;
  name: string;
  gender: "male" | "female" | "others";
  dateOfBirth?: string;
  phoneNumber: string;
  email: string;
  bloodGroup?: string;
  profileImage?: string;
  isActive: "active" | "blocked";
  isDeleted: boolean;
}

//* For creating Static Method

/* export interface StudentModel extends Model<IStudent> {
  isUserExists(id: string): Promise<IStudent | null>;
} */

//* For creating instance method
/* export type StudentMethods = {
  isuserExist(id: string): Promise<IStudent|null>;
}; */

/* export type StudentModel = Model<
  IStudent,
  Record<string, never>,
  StudentMethods
>; */
