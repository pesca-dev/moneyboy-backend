import { EVENTS, EventService } from "@moneyboy/events/event.service";
import { event, EventEmitter2, eventNS } from "eventemitter2";

describe("EventService", () => {
    let eventEmitter: EventEmitter2;
    let eventService: EventService;

    beforeEach(() => {
        eventEmitter = new EventEmitter2();
        eventService = new EventService(eventEmitter);
    });

    describe("emit", () => {
        let emitMock: jest.MockedFunction<(event: event | eventNS, ...values: any[]) => boolean>;

        beforeEach(() => {
            emitMock = jest.fn();
            jest.spyOn(eventEmitter, "emit").mockImplementation(emitMock);
        });

        it("should emit event on EventEmitter", () => {
            const payload: EVENTS["user.created"] = { email: "mail@example.com", id: "randomId", url: "example.com" };
            eventService.emit("user.created", payload);
            expect(emitMock).toHaveBeenCalledWith("user.created", payload);
        });
    });
});
