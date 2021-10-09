import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EventEmitter2, OnOptions } from "eventemitter2";

/**
 * Types of events of the application.
 */
export type EVENTS = {
    /**
     * Event, which gets fired after user is logged in.
     */
    "user.created": {
        /**
         * Id if the user.
         */
        id: string;
        /**
         * Url for the registration link.
         */
        url: string;
        /**
         * Mail of the user.
         */
        email: string;
    };
    "registration.mail.send.error": {
        id: string;
    };
};

/**
 * Service for managing events.
 *
 * @author Louis Meyer
 */
@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name);
    constructor(private eventEmitter: EventEmitter2) {}

    /**
     * Emit an event on the server.
     * @param event name of the event
     * @param payload payload of the event
     */
    public emit<K extends keyof EVENTS>(event: K, payload: EVENTS[K]) {
        this.logger.log(`Emitting '${event}'`);
        this.eventEmitter.emit(event, payload);
    }
}

/**
 * Listent to events emitted on EventService.
 * @param event name of the event
 */
export function On<K extends keyof EVENTS>(event: K, options?: OnOptions | undefined): MethodDecorator {
    return OnEvent(event, options);
}
