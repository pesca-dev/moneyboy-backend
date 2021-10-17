import { AuthModule } from "@moneyboy/auth/auth.module";
import routes from "@moneyboy/config/routes";
import { PaymentModule } from "@moneyboy/payment/payment.module";
import { UserModule } from "@moneyboy/user/user.module";
import { Route } from "nest-router";

describe("Routes", () => {
    it("should have defined structure", () => {
        expect(routes[0]).toEqual<Route>({
            path: "",
            module: AuthModule,
        });
        expect(routes[1]).toEqual<Route>({
            path: "",
            module: UserModule,
        });
        expect(routes[2]).toEqual<Route>({
            path: "",
            module: PaymentModule,
        });
    });
});
