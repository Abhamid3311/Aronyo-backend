// types/express/index.d.ts
import { IUser } from "../../src/app/modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
