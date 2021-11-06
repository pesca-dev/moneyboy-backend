import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard for guarding routes with AuthGuard("local").
 *
 * @author Louis Meyer
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
