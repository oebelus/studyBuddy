import userModel from "@/resources/user/user.model";
import HttpException from "@/utils/exceptions/http.exception";
import token, { TokenResponse } from "@/utils/token";
import { Request } from "express";
import User from "./user.interface";

class UserService {
    private user = userModel;

    /**
     * Register a new user
     */

    public async register(
        username: string, 
        email: string, 
        password:string, 
        role: string
    ): Promise<TokenResponse | Error>{
        try {
            const user = await this.user.create({ username, email, password, role });
            
            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new HttpException(400, (error as Error).message)
        }
    }

    /**
     * Login a new user
     */

    public async login(
        email: string, 
        password: string,
        req: Request
    ): Promise<TokenResponse | Error> {
        try {
            const user = await this.user.findOne({ email: email })
        
            if (!user) 
                throw new Error('Unable to find a user with that email');

            if (await user.isValidPassword(password)) {
                // @ts-ignore
                req.user = user
                const tokens: TokenResponse = token.createToken(user); 
                return tokens;
            }
            else
                throw new Error('Incorrect Password')

        } catch(error) {
            throw new Error('Unable to login user')
        }
    }

    public async findUserById(userId: string): Promise<User | null> {
        try {
            return await this.user.findById(userId).exec();
        } catch (error) {
            throw new HttpException(400, (error as Error).message);
        }
    }

    public async refreshToken(
        refreshToken: string
    ): Promise<string | Error> {
        try {
            return token.refreshAccessToken(refreshToken);
        } catch (error) {
            throw new HttpException(400, (error as Error).message);
        }
    }
}

export default UserService;