export type TUserRole = "user" | "admin" | "staff";
export type TUserStatus = "active" | "inactive" | "banned";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  image?: string;
  role: TUserRole;
  status: TUserStatus;
  isDeleted: boolean;
  createdAt?: Date;
}
