import { AuthModule } from "@auth/auth.module";
import { PaymentModule } from "@payment/payment.module";
import { UserModule } from "@user/user.module";
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
