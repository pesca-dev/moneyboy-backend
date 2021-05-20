import $ from "logsen";
import { createServer } from "./server";

const PORT = 3000;

(() => {
    const server = createServer();

    function listenCallback() {
        $.success(`Listening on port :${PORT}`);
    }

    server.listen(PORT, listenCallback);
})();
