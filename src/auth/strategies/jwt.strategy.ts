import variables from "@moneyboy/config/variables";
import { SessionService } from "@moneyboy/session/session.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { RequestUser } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

/**
 * Strategy for validating and extracting JWTs from the auth header.
 *
 * @author Louis Meyer
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly sessionService: SessionService) {
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
    public async validate(payload: any): Promise<RequestUser> {
        const session = await this.sessionService.getSession(payload?.sub ?? "");
        if (!session) {
            throw new UnauthorizedException();
        }
        return {
            ...session.user,
            session,
        };
    }
}
