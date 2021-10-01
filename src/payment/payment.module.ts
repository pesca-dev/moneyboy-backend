import { Payment } from "@models/payment";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentController } from "@payment/payment.controller";
import { PaymentService } from "@payment/payment.service";
import { UserModule } from "@user/user.module";

@Module({
    providers: [PaymentService],
    controllers: [PaymentController],
    imports: [TypeOrmModule.forFeature([Payment]), UserModule],
})
export class PaymentModule {}
