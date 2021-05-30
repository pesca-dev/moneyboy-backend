import { ISession } from "@interfaces/session";

/**
 * @author Louis Meyer
 */
export class ISessionImpl implements ISession {
    constructor(public readonly id: string, public readonly userId: string) {}
}
