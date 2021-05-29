import { ISession } from "@interfaces/session";

export class ISessionImpl implements ISession {
    constructor(public readonly id: string, public readonly userId: string) {}
}
