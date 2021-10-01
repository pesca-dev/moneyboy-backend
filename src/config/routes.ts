import { AuthModule } from "@auth/auth.module";
import { PaymentModule } from "@payment/payment.module";
import { UserModule } from "@user/user.module";
import { Routes } from "nest-router";

/**
 * Routes for the api of the application.
 */
const routes: Routes = [
    {
        path: "/auth",
        module: AuthModule,
    },
    {
        path: "/user",
        module: UserModule,
    },
    {
        path: "/payment",
        module: PaymentModule,
    },
];

export default routes;
