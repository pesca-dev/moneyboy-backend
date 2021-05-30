import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import $ from "logsen";

import { ISession } from "@interfaces/session";
import { ISessionImpl } from "@session/types/session";

/**
 * Service for managing current user sessions.
 *
 * @author Louis Meyer
 */
@Injectable()
export class SessionService {
    private sessions: Map<string, ISession> = new Map<string, ISession>();

    /**
     * Create a new session for an user.
     *
     * @param userId id of the user to create a session for
     * @returns id of the created session
     */
    public createSession(userId: string) {
        const id = uuid();
        const session = new ISessionImpl(id, userId);
        this.sessions.set(id, session);
        $.info(`Created session "${id}" for userId "${userId}"`);
        return id;
    }

    /**
     * Get a session with a certain session id.
     *
     * @param sessionId id of the session to retrieve
     * @returns the session or undefined
     */
    public getSession(sessionId: string) {
        return this.sessions.get(sessionId);
    }

    /**
     * Delete a session with the specified id.
     *
     * @param sessionId id of the session to delete
     */
    public destroySession(sessionId: string) {
        this.sessions.delete(sessionId);
    }
}
