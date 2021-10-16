import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from "@casl/ability";
import { IUser } from "@interfaces/user";
import { Payment } from "@models/payment";
import { Injectable } from "@nestjs/common";

export enum Action {
    Manage = "manage",
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete",
}

/**
 * Class for generating Casl-conform abilities.
 *
 * @author Louis Meyer
 */
@Injectable()
export class CaslAbilityFactory {
    /**
     * Create payment-abilities for a given user.
     *
     * @param user user to create abilities for
     * @returns abilities
     */
    public createForPayment(user: IUser) {
        type Subjects = InferSubjects<typeof Payment>;
        type PaymentAbility = Ability<[Action, Subjects]>;

        const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<PaymentAbility>);

        // "target" of payment can read
        can<Flat<Payment>>(Action.Read, Payment, { "to.id": user.id });

        // issuer/owner of payment can do everything
        can<Flat<Payment>>(Action.Manage, Payment, { "from.id": user.id });

        return build({
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
