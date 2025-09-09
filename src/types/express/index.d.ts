// types/express/index.d.ts

// Import the user interface
import { IUser } from "../../src/app/modules/user/user.interface";

// Extend Express namespace globally
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Important: This makes it a module declaration, not a module replacement
export {};
