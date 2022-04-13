import variables from "@moneyboy/config/variables";
import { Injectable } from "@nestjs/common";
import { Notification, Provider, Responses } from "@parse/node-apn";

@Injectable()
export class NotificationService {
    private provider: Provider;

    constructor() {
        this.provider = new Provider({
            token: {
                key: variables.notifications.key,
                keyId: variables.notifications.keyId,
                teamId: variables.notifications.teamId,
            },
        });
    }

    public async send(notification: Notification, recepients: string | string[]): Promise<Responses> {
        console.log(`Sending notification to ${recepients}`);
        return this.provider.send(notification, recepients).catch(console.log).then();
    }
}
