import userModel from "@/resources/user/user.model";
import token from "@/utils/token";
import User from "./user.interface";

class UserService {
    private user = userModel;

    /**
     * Register a new user
     */

    public async register(
        name: string, 
        email: string, 
        password:string, 
        role: string
    ): Promise<string | Error>{
        try {
            const user = await this.user.create({ name, email, password, role });
            const accessToken = token.createToken(user);

            return accessToken;
        } catch (error) {
            throw new Error('Unable to create user')
        }
    }

    /**
     * Login a new user
     */

    public async login(
        email: string, 
        password: string
    ): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email })
            
            if (!user) 
                throw new Error('Unable to find a user with that email');

            if (await user.isValidPassword(password))
                return token.createToken(user);
            else
                throw new Error('Incorrect Password')
        } catch(error) {
            throw new Error('Unable to login user')
        }
    }
}

export default UserService;