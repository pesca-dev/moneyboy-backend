import { IUser } from "@interfaces/user";
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseInterceptors,
} from "@nestjs/common";
import { PaymentService } from "@payment/payment.service";
import { PaymentDTOImpl } from "@payment/types/paymentDTO.impl";
import { Request } from "express";

@Controller("payments")
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post()
    public async createPayment(@Req() req: Request, @Body() payment: PaymentDTOImpl) {
        return this.paymentService.create(req.user as IUser, payment);
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    public async findAll() {
        return this.paymentService.findAll();
    }

    @Get(":id")
    @UseInterceptors(ClassSerializerInterceptor)
    public async findOne(@Req() req: Request, @Param("id") id: string) {
        return this.paymentService.findOne(req.user as IUser, id);
    }

    @Patch(":id")
    public async update(@Req() _req: Request, @Body() payment: PaymentDTOImpl) {
        // TODO lome: add auth check
        return this.paymentService.update(payment);
    }

    @Delete(":id")
    public async remove(@Param("id") id: string) {
        return this.paymentService.remove(id);
    }
}
