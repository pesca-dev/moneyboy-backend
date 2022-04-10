import { ISession } from "@moneyboy/interfaces/session";
import { Session } from "@moneyboy/models/session";
import { User } from "@moneyboy/models/user";
import { UserService } from "@moneyboy/user/user.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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

    public async getAll(): Promise<ISession[] | undefined> {
        return await this.sessionRepository.find();
    }

    /**
     * Create a new sessions for a provided userid and return the id of the newly created session.
     */
    public async createSession(userId: string, notificationToken?: string): Promise<string> {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        const session = Session.fromData({
            id: uuid(),
            user: user as User,
            createdAt: Date.now(),
            notificationToken,
        });
        // delete all current sessions with the same notification token
        const sessionsWithNotificationToken = notificationToken
            ? await this.getSessionsForNotificationToken(notificationToken)
            : [];
        await Promise.all(
            sessionsWithNotificationToken.map(({ id }) => {
                this.destroySession(id);
            }),
        );
        await this.sessionRepository.save(session);
        return session.id;
    }

    /**
     * Get a session with the provided id.
     */
    public async getSession(sessionId: string): Promise<ISession | undefined> {
        const relations: Keys<Session> = ["user"];
        return await this.sessionRepository.findOne({
            where: {
                id: sessionId,
            },
            relations,
        });
    }

    /**
     * Get all sessions associated with a specified notification token.
     *
     * @param notificationToken notification token to get sessions with
     */
    public async getSessionsForNotificationToken(notificationToken: string): Promise<ISession[]> {
        const relations: Keys<Session> = ["user"];
        return await this.sessionRepository.find({
            where: {
                notificationToken,
            },
            relations,
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
