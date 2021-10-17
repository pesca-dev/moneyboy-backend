import { JwtAuthGuard } from "@moneyboy/auth/guards/jwt-auth.guard";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

describe("JwtAuthGuard", () => {
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
    });

    it("should be defined", () => {
        expect(new JwtAuthGuard(reflector)).toBeDefined();
    });

    it("should extend AuthGuard('jwt')", () => {
        expect(new JwtAuthGuard(reflector)).toEqual(expect.objectContaining(new (AuthGuard("jwt"))()));
    });
});
