import variables from "@config/variables";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "@user/user.service";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * Strategy for validating and extracting JWTs from the auth header.
 *
 * @author Louis Meyer
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: variables.token.accessTokenSecret,
        });
    }

    /**
     * Validate a JWT payload from a request and return associated information.
     *
     * @param payload JWT to validate
     * @returns extracted information
     */
    public async validate(payload: any) {
        const user = await this.userService.findOneById(payload?.sub ?? "");
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
