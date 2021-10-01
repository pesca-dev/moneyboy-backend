import { IUser } from "@interfaces/user";
import { Body, Controller, Post, Req } from "@nestjs/common";
import { PaymentService } from "@payment/payment.service";
import { PaymentDTOImpl } from "@payment/types/paymentDTO.impl";
import { Request } from "express";

@Controller()
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post("/add")
    public async postAdd(@Req() req: Request, @Body() payment: PaymentDTOImpl) {
        this.paymentService.addPayment(req.user?.user as IUser, payment);
    }
}
