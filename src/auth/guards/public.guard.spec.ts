import { Public } from "@moneyboy/auth/guards/public.guard";

describe("@Public", () => {
    it("should be defined", () => {
        expect(Public()).toBeDefined();
    });
});
