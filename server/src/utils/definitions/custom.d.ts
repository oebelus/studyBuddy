import User from "@/resources/user/user.interface";
import { Request, Response } from "express"

declare namespace Express {
    interface Request {
        user?: User;
    }
    interface Response {
        user?: User;
    }
}