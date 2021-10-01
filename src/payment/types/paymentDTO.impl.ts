import { PaymentDTO } from "@interfaces/payment";
import { IsNumber, IsString } from "class-validator";

export class PaymentDTOImpl implements PaymentDTO {
    @IsString()
    to!: string;
    @IsNumber()
    amount!: number;
    @IsNumber()
    date!: number;
}
