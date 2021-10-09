import { IUser } from "@interfaces/user";
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Req, UseInterceptors } from "@nestjs/common";
import { PaymentService } from "@payment/payment.service";
import { PaymentDTOImpl } from "@payment/types/paymentDTO.impl";
import { Request } from "express";

@Controller("payments")
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post("add")
    public async postAdd(@Req() req: Request, @Body() payment: PaymentDTOImpl) {
        return this.paymentService.createPayment(req.user as IUser, payment);
    }

    @Get(":id")
    @UseInterceptors(ClassSerializerInterceptor)
    public async getById(@Req() req: Request, @Param("id") id: string) {
        return this.paymentService.getById(req.user as IUser, id);
    }
}
