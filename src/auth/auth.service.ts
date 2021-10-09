import variables from "@config/variables";
import { ISession } from "@interfaces/session";
import { JWTToken } from "@interfaces/tokens";
import { UserRegisterDTO } from "@interfaces/user";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SessionService } from "@session/session.service";
import { UserService } from "@user/user.service";
import { compareSync, hashSync } from "bcrypt";

export type ValidatedUserReturnType = {
    id: string;
};

/**
 * Service for handling most user authentication.
 *
 * @author Louis Meyer
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
    ) {}

    /**
     * Validate given user credentials.
     *
     * @param username username to validate
     * @param pass password to validate
     */
    public async validateUser(username: string, pass: string): Promise<ValidatedUserReturnType | null> {
        const user = await this.userService.findByName(username);
        if (user && compareSync(pass, user.password) && user.emailVerified) {
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
        const sessionId = await this.sessionService.createSession(user.id);
        const payload: JWTToken = { sub: sessionId };

        return {
            access_token: this.signAccessToken(payload),
            refresh_token: this.signRefreshToken(payload),
        };
    }

    /**
     * Register a new user to the system.
     *
     * @param userData userdata of the newly registered user.
     */
    public async register(userData: UserRegisterDTO): Promise<void> {
        await this.userService.createUser({
            ...userData,
            password: hashSync(userData.password, 10),
        });
    }

    /**
     * Logout of a provided session. This automatically invalidates all tokens connected with this session.
     */
    public async logout(session?: ISession) {
        if (!session) {
            throw new UnauthorizedException();
        }
        await this.sessionService.destroySession(session.id);
    }

    private signAccessToken(payload: JWTToken) {
        return this.jwtService.sign(payload);
    }

    private signRefreshToken(payload: JWTToken) {
        return this.jwtService.sign(payload, {
            secret: variables.token.refreshTokenSecret,
            expiresIn: "2 weeks",
        });
    }

    /**
     * Validate a provided refresh token and return the possibly encoded token session id.
     */
    private validateRefreshToken(token: string): JWTToken | null {
        try {
            return this.jwtService.verify(token, {
                secret: variables.token.refreshTokenSecret,
            }) as JWTToken;
        } catch {}
        return null;
    }

    /**
     * Generate a new access token for a provided refresh token.
     */
    public async renewAccessToken(refreshToken: string) {
        const sessionId = this.validateRefreshToken(refreshToken)?.sub;
        const session = await this.sessionService.getSession(sessionId ?? "");

        if (!sessionId || !session) {
            throw new UnauthorizedException();
        }

        const payload: JWTToken = {
            sub: session.id,
        };

        return {
            access_token: this.signAccessToken(payload),
        };
    }
}
