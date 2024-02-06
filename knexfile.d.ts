// knexfile.d.ts
declare module "MyKnexConfig" {
    export interface KnexConfig {
        client: string;
        connection: {
            host: string;
            database: string;
            user: string;
            password: string;
            charset: string;
        };
        migrations: {
            extension: string;
            tableName: string;
            directory: string;
        };
    }
}
