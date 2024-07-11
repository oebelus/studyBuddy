import Controller from "@/utils/interfaces/controller.interface";
import UserService from "./user.service";
import { Router, Request, Response } from "express";
import validationMiddleware from "@/middleware/validation.middleware";
import validate from '@/resources/user/user.validation'
import { NextFunction } from "express-serve-static-core";
import HttpException from "@/utils/exceptions/http.exception";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        ),
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.get(
            `${this.path}`,
            authenticatedMiddleware,
            this.getUser
        )
    }

    private register = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, email, password } = req.body;
            
            const token = await this.UserService.register(
                username,
                email,
                password,
                'user'
            );
        
            res.status(201).json({token});
        } catch (error) {
            next(new HttpException(400, (error as Error).message))
        }
    }

    private login = async(
        req: Request,
        res:Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.UserService.login(email, password, req)

            res.status(200).json({token});
        } catch (error) {
            next(new HttpException(400, (error as Error).message))
        }
    }

    // single page application, req user again to see if it's up to date
    private getUser = (
        req: Request,
        res:Response,
        next: NextFunction
    ): Response | void => {

        // @ts-ignore
        console.log("req.user", req.user);
        
        // @ts-ignore
        if (!req.user) {
            return next(new HttpException(404, "Not Logged In User"));
        }

        // @ts-ignore
        res.status(200).json({ user: req.user })
    }
}

export default UserController;