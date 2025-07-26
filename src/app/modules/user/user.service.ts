import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (userData: IUser): Promise<IUser> => {
  const user = await User.create(userData);
  return user;
};

const findUserByEmail = async (email: string) => {
  return User.findOne({ email }).select("+password");
};

const getAllUsers = async () => {
  return User.find();
};

export const userService = {
  createUser,
  findUserByEmail,
  getAllUsers,
};
