import { Controller, Get, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AppService } from "./app.service";

// const posts = [
//     {
//         username: "louis",
//         title: "Post 1",
//     },
//     {
//         username: "tim",
//         title: "Post 2",
//     },
// ];

/**
 * General app controller.
 *
 * @author Louis Meyer
 */
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("/")
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("/posts")
    public getPosts(@Req() req: Request, @Res() res: Response) {
        console.log(req.session);
        res.sendStatus(200);
        // res.json(posts.filter(post => post.username === (req as any)));
    }
}
