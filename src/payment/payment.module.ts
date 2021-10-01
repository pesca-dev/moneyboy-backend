import { Payment } from "@models/payment";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentController } from "@payment/payment.controller";
import { PaymentService } from "@payment/payment.service";
import { UserModule } from "@user/user.module";

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([Payment])],
    providers: [PaymentService],
    controllers: [PaymentController],
})
export class PaymentModule {}
