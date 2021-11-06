import { AuthService } from "@moneyboy/auth/auth.service";
import { LocalStrategy } from "@moneyboy/auth/strategies/local.strategy";
import { UnauthorizedException } from "@nestjs/common";

const dummyData = {
    username: "testuser",
    password: "password1234",
    id: "randomId",
};

describe("LocalStrategy", () => {
    let authServiceMock: AuthService;
    let localStrategy: LocalStrategy;

    beforeEach(() => {
        authServiceMock = new (jest.createMockFromModule<any>(
            "@moneyboy/auth/auth.service",
        ).AuthService)() as AuthService;
        localStrategy = new LocalStrategy(authServiceMock);
    });

    describe("validate", () => {
        beforeEach(() => {
            jest.spyOn(authServiceMock, "validateUser").mockImplementation(
                async (username: string, password: string) => {
                    if (username === dummyData.username && password === dummyData.password) {
                        return {
                            id: dummyData.id,
                        };
                    }
                    return null;
                },
            );
        });

        it("shall throw exception, if credentials are wrong", async () => {
            expect(localStrategy.validate("wrongUser", "wrongPass")).rejects.toThrowError(UnauthorizedException);
            expect(localStrategy.validate(dummyData.username, "wrongPass")).rejects.toThrowError(UnauthorizedException);
            expect(localStrategy.validate("wrongUser", dummyData.password)).rejects.toThrowError(UnauthorizedException);
        });

        it("shall return id, if credentials are wrong", async () => {
            expect(await localStrategy.validate(dummyData.username, dummyData.password)).toEqual({
                id: dummyData.id,
            });
        });
    });
});
