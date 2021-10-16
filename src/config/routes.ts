import { AuthModule } from "@moneyboy/auth/auth.module";
import { PaymentModule } from "@moneyboy/payment/payment.module";
import { UserModule } from "@moneyboy/user/user.module";
import { Routes } from "nest-router";

/**
 * Routes for the api of the application.
 */
const routes: Routes = [
    {
        path: "",
        module: AuthModule,
    },
    {
        path: "",
        module: UserModule,
    },
    {
        path: "",
        module: PaymentModule,
    },
];

export default routes;
