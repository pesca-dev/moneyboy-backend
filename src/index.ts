import env from "dotenv";
env.config();
import $ from "logsen";

import { createServer } from "./server";
import { createAuthModule } from "./services/auth";

const PORT = 3000;

(() => {
    const auth = createAuthModule();

    const server = createServer({ auth });

    function listenCallback() {
        $.success(`Listening on port :${PORT}`);
    }

    server.listen(PORT, listenCallback);
})();
