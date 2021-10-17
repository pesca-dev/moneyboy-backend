import { AuthService } from "@moneyboy/auth/auth.service";
import { EventService } from "@moneyboy/events/event.service";
import { IUser } from "@moneyboy/interfaces/user";
import { SessionService } from "@moneyboy/session/session.service";
import { UserService } from "@moneyboy/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { hashSync } from "bcrypt";
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

describe("AuthService", () => {
    let userServiceMock: UserService;
    let jwtServiceMock: JwtService;
    let sessionServiceMock: SessionService;
    let eventServiceMock: EventService;

    let authService: AuthService;

    beforeEach(() => {
        userServiceMock = new (jest.createMockFromModule<any>("@moneyboy/user/user.service").UserService)();
        jwtServiceMock = new (jest.createMockFromModule<any>("@nestjs/jwt").JwtService)();
        sessionServiceMock = new (jest.createMockFromModule<any>("@moneyboy/session/session.service").SessionService)();
        eventServiceMock = new (jest.createMockFromModule<any>("@moneyboy/events/event.service").EventService)();

        authService = new AuthService(userServiceMock, jwtServiceMock, sessionServiceMock, eventServiceMock);
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
});
