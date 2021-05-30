import { Injectable } from "@nestjs/common";

import { TokenService } from "@token/token.service";
import { UserLoginDTO } from "@interfaces/user";
import { MaybeError } from "@interfaces/error";
import { UserService } from "@user/user.service";
import { SessionService } from "@session/session.service";

const defaultUsers = ["louis", "tom", "test"];

type TokenObject = {
    accessToken: string;
    refreshToken: string;
};

/**
 * Service for handling authentication.
 *
 * @author Louis Meyer
 */
@Injectable()
export class AuthService {
    private users: Map<string, string> = new Map<string, string>();

    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
    ) {
        defaultUsers.forEach(u => this.users.set(u, this.userService.createUser(u)));
    }

    /**
     * Try to log a user in.
     *
     * @param user user to log in
     * @returns the access and refresh tokens for this session
     */
    public login(user: UserLoginDTO): MaybeError<TokenObject> {
        // TODO lome: add actual authentication
        const userId = this.users.get(user.username);
        if (!userId) {
            return [true];
        }

        // create a new session for this user
        // TODO lome: add spam protection
        const sessionId = this.sessionService.createSession(userId);

        // generate tokens for the newly created session
        const accessToken = this.tokenService.generateAccessToken(sessionId);
        const refreshToken = this.tokenService.generateRefreshToken(sessionId);

        return [
            null,
            {
                accessToken,
                refreshToken,
            },
        ];
    }

    /**
     * Verify a provided refresh token and return a newly generated access token, if successful.
     *
     * @param refreshToken refresh token to verify
     * @returns the new access token, or [err] if there is no session
     */
    public async verifyRefreshToken(refreshToken: string): Promise<MaybeError<string>> {
        const [err, sessionId] = await this.tokenService.verifyRefreshToken(refreshToken);
        if (err || !sessionId) {
            return [err];
        }
        const accessToken = this.tokenService.generateAccessToken(sessionId);
        return [null, accessToken];
    }
}
