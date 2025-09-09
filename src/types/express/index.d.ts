import { IUser } from "src/app/modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // optional, added by your auth middleware
    }
  }
}
