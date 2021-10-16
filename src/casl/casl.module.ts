import { CaslAbilityFactory } from "@casl/casl-ability.factory";
import { Module } from "@nestjs/common";

/**
 * Module containing all relevant classes for Casl abilities.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [CaslAbilityFactory],
    exports: [CaslAbilityFactory],
})
export class CaslModule {}
