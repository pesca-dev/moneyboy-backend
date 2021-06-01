import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "typeorm";

/**
 * Service for handling database related stuff.
 *
 * @author Louis Meyer
 */
@Injectable()
export class DatabaseService {
    constructor(@Inject("TYPEORM_CONNECTION") private readonly connection: Connection) {}

    public getConnection() {
        return this.connection;
    }
}
