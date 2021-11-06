import { LocalAuthGuard } from "@moneyboy/auth/guards/local-auth.guard";
import { AuthGuard } from "@nestjs/passport";

describe("LocalAuthGuard", () => {
    it("should be defined", () => {
        expect(new LocalAuthGuard()).toBeDefined();
    });

    it("should extend AuthGuard('local')", () => {
        expect(new LocalAuthGuard()).toEqual(expect.objectContaining(new (AuthGuard("local"))()));
    });
});
