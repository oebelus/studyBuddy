import jwt from "jsonwebtoken";
import User from '@/resources/user/user.interface';
import Token from "@/utils/interfaces/token.interface";

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

interface RefreshTokenPayload {
    id: string;
    type: 'refresh';
}

export const generateRefreshToken = (id: string): string => {
    return jwt.sign({ 
        id: id, 
        type: 'refresh'
    }, 
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret, 
    {
        expiresIn: '7d',
    })
}

export const createToken = (user: User): TokenResponse => {
    const accessToken = jwt.sign({ 
        id: user._id, 
        username: user.username, 
        email: user.email,
        type: 'access'
    }, 
    process.env.JWT_SECRET as jwt.Secret, 
    {
        expiresIn: '15m',
    })

    const refreshToken = jwt.sign({ 
        id: user._id,
        type: 'refresh'
    }, 
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret, 
    {
        expiresIn: '7d',
    })

    return { accessToken, refreshToken };
}

export const verifyToken = async (
    token: string,
    isRefreshToken: boolean = false
): Promise<Token> => {

    const secret = isRefreshToken 
        ? process.env.REFRESH_TOKEN_SECRET as jwt.Secret
        : process.env.JWT_SECRET as jwt.Secret

    return new Promise((resolve, reject) => {
        jwt.verify(
            token, 
            secret,
            (err, payload) => {
                 if (err) {
                    if (err.name === 'TokenExpiredError') {
                        reject({
                            name: 'TokenExpiredError',
                            message: 'Token has expired',
                            expiredAt: (err as jwt.TokenExpiredError).expiredAt
                        })
                    } else {
                        reject({
                            name: 'TokenVerificationError',
                            message: 'Invalid Token'
                        })
                    }
                } else {
                    resolve(payload as Token);
                }
            }
        )
    })
}

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as jwt.Secret) as RefreshTokenPayload;
        if (payload.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        const newAccessToken = jwt.sign({
            id: payload.id,
            type: 'access'
        },
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: '15m'
        })
        return newAccessToken;
    } catch (error) {
        console.error('Token verification error:', error);
        throw new Error('Invalid refresh token');
    }
}

export default {createToken, verifyToken, refreshAccessToken};