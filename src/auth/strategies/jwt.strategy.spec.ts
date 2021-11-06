import { JwtStrategy } from "@moneyboy/auth/strategies/jwt.strategy";
import { ISession } from "@moneyboy/interfaces/session";
import { IUser } from "@moneyboy/interfaces/user";
import { SessionService } from "@moneyboy/session/session.service";
import { UnauthorizedException } from "@nestjs/common";
import { hashSync } from "bcrypt";
import { RequestUser } from "express";
import { v4 as uuid } from "uuid";

const dummyPassword = "dummyPassword";
const dummyUser: IUser = {
    id: uuid(),
    displayName: "Display Name",
    email: "mail@example.com",
    emailVerified: true,
    password: hashSync(dummyPassword, 10),
    username: "dummyUser",
};
const dummySession: ISession = {
    id: uuid(),
    createdAt: Date.now(),
    user: dummyUser,
};

describe("JwtStrategy", () => {
    let sessionServiceMock: SessionService;
    let jwtStrategy: JwtStrategy;

    beforeEach(() => {
        sessionServiceMock = new (jest.createMockFromModule<any>("@moneyboy/session/session.service").SessionService)();
        jwtStrategy = new JwtStrategy(sessionServiceMock);
    });

    describe("validate", () => {
        let getSessionMock: jest.MockedFunction<(id: string) => Promise<ISession | undefined>>;

        beforeEach(() => {
            getSessionMock = jest.fn(async (id: string): Promise<ISession | undefined> => {
                if (id === dummySession.id) {
                    return dummySession;
                }
                return undefined;
            });
            jest.spyOn(sessionServiceMock, "getSession").mockImplementation(getSessionMock);
        });

        it("should be defined", () => {
            expect(jwtStrategy.validate).toBeDefined();
        });

        it("should throw UnauthorizedException, if payload is invalid", () => {
            expect(
                jwtStrategy.validate({
                    sub: "wrongSessionId",
                }),
            ).rejects.toThrowError(UnauthorizedException);
        });

        it("should return RequestUser on success", async () => {
            const user: RequestUser = await jwtStrategy.validate({
                sub: dummySession.id,
            });

            expect(user).toEqual<RequestUser>({
                ...dummyUser,
                session: dummySession,
            });
        });
    });
});
