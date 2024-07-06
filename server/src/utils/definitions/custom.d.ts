import User from "@/resources/user/user.interface";
import * as express from "express"

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}