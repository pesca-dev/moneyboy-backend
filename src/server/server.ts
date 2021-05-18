import express from "express";

/**
 * Class for wrapping around our server. Maybe switch to functional style later.
 * 
 * (functional style would be better, i think)
 */
export class Server {
    private static readonly PORT = 3000;

    private _express: express.Application;

    constructor(port?: number) {
        this._express = express();
        this.bind();
        this.listen(port ?? Server.PORT);
    }

    private bind() {
        this._express.get("/", (_, res) => {
            res.send("Hello, world!");
        });
    }

    private listen(port: number) {
        this._express.listen(port, () => {
            console.log(`Listening to port ${port}`);
        });
    }
}
