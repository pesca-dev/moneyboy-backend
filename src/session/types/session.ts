import { ISession } from "@interfaces/session";

export class Session implements ISession {
    constructor(public readonly id: string, public readonly userId: string) {}
}
