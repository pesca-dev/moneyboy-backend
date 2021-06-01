import { Routes } from "nest-router";

import { AuthModule } from "@auth/auth.module";
import { UserModule } from "@user/user.module";

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
];

export default routes;
