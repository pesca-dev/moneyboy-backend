import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

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
}
