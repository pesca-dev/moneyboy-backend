import { ISession } from "@moneyboy/interfaces/session";
import { Session } from "@moneyboy/models/session";
import { SessionService } from "@moneyboy/session/session.service";
import { UserService } from "@moneyboy/user/user.service";
import { Repository } from "typeorm";

const dummySession: ISession = {
    id: "magicId",
    createdAt: 123456,
    user: {
        id: "randomUserId",
        username: "dummyUser",
        displayName: "Dummy User",
        password: "password",
        email: "test@example.com",
        emailVerified: true,
        sessions: [],
    },
};

describe("SessionService", () => {
    let userServiceMock: UserService;
    let sessionRepositoryMock: Repository<Session>;
    let sessionService: SessionService;

    beforeEach(() => {
        userServiceMock = new (jest.createMockFromModule<any>(
            "@moneyboy/user/user.service",
        ).UserService)() as UserService;
        sessionRepositoryMock = new (jest.createMockFromModule<any>("typeorm").Repository)() as Repository<Session>;
        sessionService = new SessionService(userServiceMock, sessionRepositoryMock);
    });

    describe("getSession", () => {
        beforeEach(() => {
            jest.spyOn(sessionRepositoryMock, "findOne").mockImplementation(async ({ where: { id } }: any) => {
                if (id === dummySession.id) {
                    return dummySession;
                } else {
                    return undefined;
                }
            });
        });

        it("shall return undefined, if session is not present", async () => {
            const session = await sessionService.getSession("someRandomId");
            expect(session).toBeUndefined();
        });

        it("shall return session, if id is valid", async () => {
            const session = await sessionService.getSession(dummySession.id);
            expect(session).toStrictEqual(dummySession);
        });
    });

    describe("destroySession", () => {
        beforeEach(() => {
            jest.spyOn(sessionRepositoryMock, "findOne").mockImplementation(async ({ where: { id } }: any) => {
                if (id === dummySession.id) {
                    return dummySession;
                } else {
                    return undefined;
                }
            });
        });

        it("shall delete a session if id is present and valid", async () => {
            const mock = jest.fn();
            jest.spyOn(sessionRepositoryMock, "remove").mockImplementation(async () => mock());
            await sessionService.destroySession(dummySession.id);
            expect(mock).toBeCalled();
        });

        it("shall not delete a session if id is not valid or present", async () => {
            const mock = jest.fn();
            jest.spyOn(sessionRepositoryMock, "remove").mockImplementation(async () => mock());
            await sessionService.destroySession("randomSessionId");
            expect(mock).toBeCalledTimes(0);
        });
    });
});
