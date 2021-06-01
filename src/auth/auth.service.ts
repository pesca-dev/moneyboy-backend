import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@user/user.service";

type ValidatedUserReturnType = {
    id: string;
};

/**
 * Service for handling most user authentication.
 *
 * @author Louis Meyer
 */
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    /**
     * Validate given user credentials.
     *
     * @param username username to validate
     * @param pass password to validate
     */
    public async validateUser(username: string, pass: string): Promise<ValidatedUserReturnType | null> {
        const user = await this.userService.findOne(username);
        if (user && (user as any).password === pass) {
            const { id } = user;
            return {
                id,
            };
        }
        return null;
    }

    /**
     * Log a user in and return the access token for this user.
     */
    public async login(user: ValidatedUserReturnType) {
        console.log(user);
        const payload = { sub: user.id };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
