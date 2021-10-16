import { EventService } from "@moneyboy/events/event.service";
import { Module } from "@nestjs/common";

/**
 * Module for handling all kind of events.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [EventService],
    exports: [EventService],
})
export class EventModule {}
