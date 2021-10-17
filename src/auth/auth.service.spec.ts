import { AuthService } from "@moneyboy/auth/auth.service";
import variables from "@moneyboy/config/variables";
import { EventService } from "@moneyboy/events/event.service";
import { ISession } from "@moneyboy/interfaces/session";
import { IUser } from "@moneyboy/interfaces/user";
import { SessionService } from "@moneyboy/session/session.service";
import { UserService } from "@moneyboy/user/user.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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
const dummySessionId = uuid();

describe("AuthService", () => {
    let userServiceMock: UserService;
    let jwtService: JwtService;
    let sessionServiceMock: SessionService;
    let eventServiceMock: EventService;

    let authService: AuthService;

    beforeEach(() => {
        userServiceMock = new (jest.createMockFromModule<any>("@moneyboy/user/user.service").UserService)();
        jwtService = new JwtService({ secret: variables.token.accessTokenSecret });
        sessionServiceMock = new (jest.createMockFromModule<any>("@moneyboy/session/session.service").SessionService)();
        eventServiceMock = new (jest.createMockFromModule<any>("@moneyboy/events/event.service").EventService)();

        authService = new AuthService(userServiceMock, jwtService, sessionServiceMock, eventServiceMock);
    });

    describe("validateUser", () => {
        beforeEach(() => {
            jest.spyOn(userServiceMock, "findByName").mockImplementation(async (username: string) => {
                if (username === dummyUser.username) {
                    return dummyUser;
                }
                return undefined;
            });
        });

        it("should be defined", () => {
            expect(authService.validateUser).toBeDefined();
        });

        it("should return correct id, when credentials are correct", () => {
            expect(authService.validateUser(dummyUser.username, dummyPassword)).resolves.toEqual({
                id: dummyUser.id,
            });
        });

        it("should return null, when credentials are wrong", () => {
            expect(authService.validateUser("randomUser", "randomPass")).resolves.toBeNull();
            expect(authService.validateUser(dummyUser.username, "randomPass")).resolves.toBeNull();
            expect(authService.validateUser("randomUser", dummyPassword)).resolves.toBeNull();
        });
    });

    describe("login", () => {
        beforeEach(() => {
            jest.spyOn(sessionServiceMock, "createSession").mockImplementation(async () => {
                return dummySessionId;
            });
        });

        it("should be defined", () => {
            expect(authService.login).toBeDefined();
        });

        it("should return encoded session IDs", async () => {
            const returnValue = await authService.login({
                id: dummyUser.id,
            });
            expect(jwtService.verify(returnValue.access_token).sub).toEqual(dummySessionId);
            expect(
                jwtService.verify(returnValue.refresh_token, {
                    secret: variables.token.refreshTokenSecret,
                }).sub,
            ).toEqual(dummySessionId);
        });
    });

    describe("register", () => {
        let createUserMock: jest.MockedFunction<(arg0: any) => Promise<IUser>>;
        let eventEmitMock: jest.MockedFunction<(event: string, payload: any) => void>;

        beforeEach(() => {
            jest.spyOn(userServiceMock, "findByName").mockImplementation(async (username: string) => {
                if (username === dummyUser.username) {
                    return dummyUser;
                }
                return undefined;
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            createUserMock = jest.fn(async (_data: any) => {
                return dummyUser;
            });
            jest.spyOn(userServiceMock, "createUser").mockImplementation(createUserMock);

            eventEmitMock = jest.fn();
            jest.spyOn(eventServiceMock, "emit").mockImplementation(eventEmitMock);
        });

        it("should be defined", () => {
            expect(authService.register).toBeDefined();
        });

        it("should throw BadRequestException on invalid email", () => {
            jest.spyOn(userServiceMock, "findByName").mockImplementation(async (username: string) => {
                if (username === dummyUser.username) {
                    return { ...dummyUser, emailVerified: false };
                }
                return undefined;
            });
            expect(authService.register({ ...dummyUser, email: "anoter@example.com" })).rejects.toThrow(
                BadRequestException,
            );
        });

        it("should throw BadRequestException if emailIsVerified", () => {
            expect(authService.register(dummyUser)).rejects.toThrow(BadRequestException);
        });

        it("should create a user in the userService", async () => {
            await authService.register({ ...dummyUser, username: "anotherUser" });
            expect(createUserMock).toHaveBeenCalled();
        });

        it("should emit 'user.created' with correct payload", async () => {
            await authService.register({ ...dummyUser, username: "anotherUser" });
            expect(eventEmitMock).toHaveBeenCalledWith(
                "user.created",
                expect.objectContaining({ email: dummyUser.email, id: dummyUser.id }),
            );
        });
    });

    describe("handleRegistrationMainError", () => {
        let deleteUserMock: jest.MockedFunction<(id: string) => Promise<void>>;

        beforeEach(() => {
            deleteUserMock = jest.fn();
            jest.spyOn(userServiceMock, "deleteUser").mockImplementation(deleteUserMock);
        });

        it("should be defined", () => {
            expect(authService.handleRegistrationMailError).toBeDefined();
        });

        it("should delete user in userService", async () => {
            await authService.handleRegistrationMailError({ id: dummyUser.id });
            expect(deleteUserMock).toHaveBeenCalledWith(dummyUser.id);
        });
    });

    describe("logout", () => {
        let destroySessionMock: jest.MockedFunction<(id: string) => Promise<void>>;

        beforeEach(() => {
            destroySessionMock = jest.fn();
            jest.spyOn(sessionServiceMock, "destroySession").mockImplementation(destroySessionMock);
        });

        it("should be defined", () => {
            expect(authService.logout).toBeDefined();
        });

        it("should throw UnauthorizedException, if user is undefined", () => {
            expect(authService.logout()).rejects.toThrow(UnauthorizedException);
        });

        it("should destroy the session in sessionService", async () => {
            const user: RequestUser = {
                ...dummyUser,
                session: {
                    id: dummySessionId,
                    createdAt: Date.now(),
                    user: dummyUser,
                },
            };
            await authService.logout(user);
            expect(destroySessionMock).toHaveBeenCalledWith(dummySessionId);
        });
    });

    describe("renewAccessToken", () => {
        let refreshToken: string;
        let invalidSecret: string;
        let invalidSessionId: string;

        let getSessionMock: jest.MockedFunction<(id: string) => Promise<ISession | undefined>>;

        beforeEach(() => {
            refreshToken = jwtService.sign(
                {
                    sub: dummySessionId,
                },
                {
                    secret: variables.token.refreshTokenSecret,
                },
            );

            invalidSecret = jwtService.sign(
                {
                    sub: dummySessionId,
                },
                {
                    secret: "falseSecret",
                },
            );

            invalidSessionId = jwtService.sign(
                {
                    sub: "falseSessionId",
                },
                {
                    secret: variables.token.refreshTokenSecret,
                },
            );

            getSessionMock = jest.fn(async (id: string): Promise<ISession | undefined> => {
                if (id === dummySessionId) {
                    return {
                        id: dummySessionId,
                        user: dummyUser,
                        createdAt: Date.now(),
                    };
                }
                return undefined;
            });
            jest.spyOn(sessionServiceMock, "getSession").mockImplementation(getSessionMock);
        });

        it("should be defined", () => {
            expect(authService.renewAccessToken).toBeDefined();
        });

        it("should throw UnauthorizedException on invalid tokens", () => {
            expect(authService.renewAccessToken(invalidSecret)).rejects.toThrow(UnauthorizedException);
            expect(authService.renewAccessToken(invalidSessionId)).rejects.toThrow(UnauthorizedException);
        });

        it("should return a new access_token", async () => {
            const payload = await authService.renewAccessToken(refreshToken);
            expect(payload.access_token).toBeDefined();

            expect(
                jwtService.verify(payload.access_token, {
                    secret: variables.token.accessTokenSecret,
                }).sub,
            ).toEqual(dummySessionId);
        });
    });

    describe("verifyUser", () => {
        let verifyUserMock: jest.MockedFunction<(token: string) => Promise<void>>;

        beforeEach(() => {
            verifyUserMock = jest.fn();
            jest.spyOn(userServiceMock, "verifyUser").mockImplementation(verifyUserMock);
        });

        it("should be defined", () => {
            expect(authService.verifyUser).toBeDefined();
        });

        it("should call UserService.verifyUser", async () => {
            const token = "someToken";
            await authService.verifyUser(token);
            expect(verifyUserMock).toHaveBeenCalledWith(token);
        });
    });
});
