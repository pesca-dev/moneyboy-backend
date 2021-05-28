import { config } from "dotenv";
config();
import { bootstrap } from "./server";

(() => {
    bootstrap();
})();
