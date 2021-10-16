import { Action, CaslAbilityFactory } from "@moneyboy/casl/casl-ability.factory";
import { IPayment } from "@moneyboy/interfaces/payment";
import { IUser } from "@moneyboy/interfaces/user";
import { PaymentService } from "@moneyboy/payment/payment.service";
import { PaymentCreateDTOImpl, PaymentUpdateDTOImpl } from "@moneyboy/payment/types/paymentDTO.impl";
import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UseInterceptors,
} from "@nestjs/common";
import { Request } from "express";

/**
 * Controller managing all payment routes.
 *
 * @author Louis Meyer
 */
@Controller("payments")
export class PaymentController {
    constructor(private paymentService: PaymentService, private abilityFactory: CaslAbilityFactory) {}

    /**
     * Create a new payment.
     *
     * @returns the newly created payment
     */
    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    public async createPayment(@Req() req: Request, @Body() payment: PaymentCreateDTOImpl): Promise<IPayment> {
        return this.paymentService.create(req.user as IUser, payment);
    }

    /**
     * Get all payments that are relevant for the authed user.
     * TODO lome:
     *
     * @returns array containing all payments
     */
    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    public async findAll(): Promise<IPayment[]> {
        return this.paymentService.findAll();
    }

    /**
     * Find a payment by the specified id.
     *
     * @throws NotFoundException, if payment is not found
     * @throws UnauthorizedException, if user is not authorized to view the payment
     * @returns the payment
     */
    @Get(":id")
    @UseInterceptors(ClassSerializerInterceptor)
    public async findOne(@Req() req: Request, @Param("id") id: string): Promise<IPayment> {
        const payment: IPayment | undefined = await this.paymentService.findOne(id);
        if (!payment) throw new NotFoundException();

        const ability = this.abilityFactory.createForPayment(req.user as IUser);
        if (ability.cannot(Action.Read, payment)) throw new UnauthorizedException();
        return payment;
    }

    /**
     * Update a payment.
     *
     * @throws BadRequestException, if provided IDs do not match
     * @throws NotFoundException, if payment is not found
     * @throws UnauthorizedException, if user is not authorized to update the payment
     */
    @Patch(":id")
    public async update(
        @Req() req: Request,
        @Param("id") id: string,
        @Body() payload: PaymentUpdateDTOImpl,
    ): Promise<void> {
        if (id !== payload.id) throw new BadRequestException("IDs do not match");
        const payment: IPayment | undefined = await this.paymentService.findOne(id);
        if (!payment) throw new NotFoundException();

        const ability = this.abilityFactory.createForPayment(req.user as IUser);
        if (ability.cannot(Action.Update, payment)) throw new UnauthorizedException();
        return this.paymentService.update({ ...payload, id });
    }

    /**
     * Delete a payment.
     *
     * @throws NotFoundException, if payment is not found
     * @throws UnauthorizedException, if user is not authorized to delete the payment
     * @returns the payment
     */
    @Delete(":id")
    public async remove(@Req() req: Request, @Param("id") id: string) {
        const payment: IPayment | undefined = await this.paymentService.findOne(id);
        if (!payment) throw new BadRequestException();

        const ability = this.abilityFactory.createForPayment(req.user as IUser);
        if (ability.cannot(Action.Delete, payment)) throw new UnauthorizedException();
        return this.paymentService.remove(id);
    }
}
