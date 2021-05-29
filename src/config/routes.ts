import { Routes } from "nest-router";

import { AuthModule } from "@auth/auth.module";

/**
 * Routes for the api of the application.
 */
const routes: Routes = [
    {
        path: "/auth",
        module: AuthModule,
    },
];

export default routes;
