import jwt from "jsonwebtoken";
import User from '@/resources/user/user.interface';
import Token from "@/utils/interfaces/token.interface";

export const createToken = (user: User): string => {
    return jwt.sign({ 
        id: user._id, 
        username: user.username, 
        email: user.email 
    }, 
    process.env.JWT_SECRET as jwt.Secret, 
    {
        expiresIn: '1d',
    })
}

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token, 
            process.env.JWT_SECRET as jwt.Secret, 
            (err, payload) => {
                 if (err) {
                    console.error('JWT Verification Error', err);
                    reject(err);
                } else {
                    resolve(payload as Token);
                }
            }
        )
    })
}

export default {createToken, verifyToken};