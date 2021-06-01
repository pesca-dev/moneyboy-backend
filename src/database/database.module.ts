import { IUserImpl } from "@models/iUserImpl";
import { Module } from "@nestjs/common";
import { DatabaseService } from "@database/database.service";
import { createConnection } from "typeorm";
import variables from "@config/variables";

/**
 * Module for handling database-related stuff.
 *
 * @author Louis Meyer
 */
@Module({
    providers: [
        DatabaseService,
        {
            provide: "TYPEORM_CONNECTION",
            useFactory: async () => {
                const connection = await createConnection({
                    type: "mysql",
                    host: variables.database.host,
                    port: variables.database.port,
                    username: variables.database.username,
                    password: variables.database.password,
                    database: variables.database.name,
                    entities: [IUserImpl],
                    synchronize: true,
                });
                return connection;
            },
        },
    ],
    exports: [DatabaseService],
})
export class DatabaseModule {}
