import { IUser } from "../../lib/types"; // path to your IUser

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // optional, added by your auth middleware
    }
  }
}
