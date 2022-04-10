import { CaslModule } from "@moneyboy/casl/casl.module";
import { Payment } from "@moneyboy/models/payment";
import { NotificationModule } from "@moneyboy/notification/notification.module";
import { PaymentController } from "@moneyboy/payment/payment.controller";
import { PaymentService } from "@moneyboy/payment/payment.service";
import { UserModule } from "@moneyboy/user/user.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

/**
 * Module containig all classes for managing payments.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [PaymentService],
    controllers: [PaymentController],
    imports: [TypeOrmModule.forFeature([Payment]), UserModule, CaslModule, NotificationModule],
})
export class PaymentModule {}
