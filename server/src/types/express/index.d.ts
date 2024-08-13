import { User } from './user.model'; // Adjust the path according to your project structure

declare global {
    namespace Express {
        interface Request {
            user?: User; // Add the user property to the Request object
        }
    }
}
