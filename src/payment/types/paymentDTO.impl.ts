import { PaymentCreateDTO, PaymentUpdateDTO } from "@moneyboy/interfaces/payment";
import { IsNumber, IsString, IsUUID } from "class-validator";

export class PaymentCreateDTOImpl implements PaymentCreateDTO {
    @IsString()
    to!: string;
    @IsNumber()
    amount!: number;
    @IsNumber()
    date!: number;
}

export class PaymentUpdateDTOImpl extends PaymentCreateDTOImpl implements PaymentUpdateDTO {
    @IsUUID()
    id!: string;
}
