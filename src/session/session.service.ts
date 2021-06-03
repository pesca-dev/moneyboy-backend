import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { v4 as uuid } from "uuid";

import { UserService, UserServiceKey } from "@user/user.service";
import { ISessionImpl } from "@models/iSessionImpl";
import { IUserImpl } from "@models/iUserImpl";
import { ISession } from "@interfaces/session";

/**
 * Service for managing login sessions.
 *
 * @author Louis Meyer
 */
@Injectable()
export class SessionService {
    constructor(@Inject(UserServiceKey) private readonly userService: UserService) {}

    /**
     * Create a new sessions for a provided userid and return the id of the newly created session.
     */
    public async createSession(userId: string): Promise<string> {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        const session = ISessionImpl.fromData({
            id: uuid(),
            user: user as IUserImpl,
            createdAt: Date.now(),
        });
        await session.save();
        return session.id;
    }

    /**
     * Get a session with the provided id.
     */
    public async getSession(sessionId: string): Promise<ISession | undefined> {
        return await ISessionImpl.findOne({
            where: {
                id: sessionId,
            },
            relations: ["user"],
        });
    }

    /**
     * Delete a session with the provided id.
     */
    public async destroySession(sessionId: string): Promise<void> {
        const session = await ISessionImpl.findOne({
            where: {
                id: sessionId,
            },
        });
        if (session) {
            await session.remove();
        }
    }
}
