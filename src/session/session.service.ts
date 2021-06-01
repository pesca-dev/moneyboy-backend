import { Injectable } from "@nestjs/common";
import { v4 as uuid } from "uuid";

import { ISession } from "@interfaces/session";
import { Session } from "@session/types/session";

/**
 * Service for managing login sessions.
 *
 * @author Louis Meyer
 */
@Injectable()
export class SessionService {
    private sessions: Map<string, ISession> = new Map<string, ISession>();

    /**
     * Create a new sessions for a provided userid and return the id of the newly created session.
     */
    public createSession(userId: string) {
        const sid = uuid();
        this.sessions.set(sid, new Session(sid, userId));
        return sid;
    }

    /**
     * Get a session with the provided id.
     */
    public async getSession(sessionId: string) {
        return this.sessions.get(sessionId);
    }

    /**
     * Delete a session with the provided id.
     */
    public destroySession(sessionId: string) {
        this.sessions.delete(sessionId);
    }
}
