import { User } from "@models/user";

/**
 * Interface representing a payment.
 *
 * @author Louis Meyer
 */
export interface IPayment {
    /**
     * ID of the payment, set by the server
     */
    id: string;
    /**
     * ID of the user, who issued the payment.
     */
    from: User;
    /**
     * The recepient of the payment.
     */
    to: User;
    /**
     * Amount of the payment.
     */
    amount: number;
    /**
     * Date of the payment.
     */
    date: number;
}

/**
 * Interface for adding a new payment.
 *
 * @author Louis Meyer
 */
export interface PaymentCreateDTO {
    /**
     * ID of the user this payment is issued for.
     */
    to: string;

    /**
     * Amount of this payment.
     */
    amount: number;

    /**
     * Date of this payment.
     */
    date: number;
}

/**
 * Interface for updating a payment.
 *
 * @author Louis Meyer
 */
export interface PaymentUpdateDTO extends PaymentCreateDTO {
    /**
     * ID of this payment.
     */
    id: string;
}
