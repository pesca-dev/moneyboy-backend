import variables from "@moneyboy/config/variables";
import { EVENTS, EventService, On } from "@moneyboy/events/event.service";
import { JWTToken } from "@moneyboy/interfaces/tokens";
import { UserRegisterDTO } from "@moneyboy/interfaces/user";
import { SessionService } from "@moneyboy/session/session.service";
import { UserService } from "@moneyboy/user/user.service";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compareSync, hashSync } from "bcrypt";
import { RequestUser } from "express";

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
        private readonly eventService: EventService,
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
        // check, if user already exists
        let user = await this.userService.findByName(userData.username);
        if (user) {
            if (user.emailVerified || user.email !== userData.email) {
                // user exists and is verified
                throw new BadRequestException("Username already exists");
            }
        } else {
            // try to create a new user
            user = await this.userService.createUser({
                ...userData,
                password: hashSync(userData.password, 10),
            });
        }

        // try to send verification mail to user
        const jwt = this.signVerifyToken(user.id);
        const url = `${variables.host}/auth/verify?t=${jwt}`;
        this.eventService.emit("user.created", {
            id: user.id,
            url,
            email: user.email,
        });
    }

    /**
     * Handle errors occuring while sending registration mail.
     */
    @On("registration.mail.send.error")
    public async handleRegistrationMailError({ id }: EVENTS["registration.mail.send.error"]): Promise<void> {
        return this.userService.deleteUser(id);
    }

    /**
     * Logout of a provided session. This automatically invalidates all tokens connected with this session.
     */
    public async logout(user?: RequestUser): Promise<void> {
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.sessionService.destroySession(user.session.id);
    }

    private signAccessToken(payload: JWTToken): string {
        return this.jwtService.sign(payload, {
            expiresIn: "15m",
        });
    }

    private signRefreshToken(payload: JWTToken): string {
        return this.jwtService.sign(payload, {
            secret: variables.token.refreshTokenSecret,
            expiresIn: "2 weeks",
        });
    }

    private signVerifyToken(payload: string): string {
        return this.jwtService.sign(payload, {
            secret: variables.token.verifyTokenSecret,
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

    public async verifyUser(token: string): Promise<void> {
        return this.userService.verifyUser(token);
    }
}
