import { NotificationService } from "@moneyboy/notification/notification.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [NotificationService],
    exports: [NotificationService],
})
export class NotificationModule {}
