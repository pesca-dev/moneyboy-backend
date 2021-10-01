import { ISession } from "@interfaces/session";
import { Session } from "@models/session";
import { User } from "@models/user";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "@user/user.service";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";

/**
 * Service for managing login sessions.
 *
 * @author Louis Meyer
 */
@Injectable()
export class SessionService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
    ) {}

    /**
     * Create a new sessions for a provided userid and return the id of the newly created session.
     */
    public async createSession(userId: string): Promise<string> {
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        const session = Session.fromData({
            id: uuid(),
            user: user as User,
            createdAt: Date.now(),
        });
        await this.sessionRepository.save(session);
        return session.id;
    }

    /**
     * Get a session with the provided id.
     */
    public async getSession(sessionId: string): Promise<ISession | undefined> {
        return await this.sessionRepository.findOne({
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
        const session = await this.sessionRepository.findOne({
            where: {
                id: sessionId,
            },
        });
        if (session) {
            await this.sessionRepository.remove(session);
        }
    }
}
