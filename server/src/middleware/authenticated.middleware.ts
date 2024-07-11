import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/token";
import userModel from "@/resources/user/user.model";
import Token from "@/utils/interfaces/token.interface";
import HttpException from "@/utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {    
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorized'))
    }

    const accessToken = bearer.split('Bearer ')[1].trim();  
    
    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken.slice(1, accessToken.length-1).trim())

        if (payload instanceof jwt.JsonWebTokenError) {
            console.log("UNAUTHORIZED");
            
            return next(new HttpException(401, 'Unauthorized'))
        }

        const user = await userModel.findById(payload.id)
            .select('-password')
            .exec()

        if (!user) {
            console.log("NO USER");
            
            return next(new HttpException(401, 'Unauthorized'))
        }

        // @ts-ignore
        req.user = user;
        
        next()
    } catch (error) {
        console.error('Token verification error:', error);
    }
}

export default authenticatedMiddleware;