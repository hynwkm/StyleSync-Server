import dotenv from "dotenv";
import knex, { Knex } from "knex";

dotenv.config();

interface DBConfig {
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
}

let knexConn: Knex;
async function connect(): Promise<Knex> {
    let connectionConfig: Knex.Config;
    if (process.env.JAWSDB_URL) {
        const dbUrl = new URL(process.env.JAWSDB_URL);
        const dbConfig: DBConfig = {
            host: dbUrl.hostname,
            port: dbUrl.port ? parseInt(dbUrl.port) : undefined,
            user: dbUrl.username,
            password: dbUrl.password,
            database: dbUrl.pathname.slice(1),
        };

        connectionConfig = {
            client: "mysql2",
            connection: dbConfig,
        };
    } else {
        const dbConfig: DBConfig = {
            host: "127.0.0.1",
            user: "root",
            password: "rootroot",
            database: "stylesync",
        };

        connectionConfig = {
            client: "mysql2",
            connection: dbConfig,
        };
    }

    knexConn = knex(connectionConfig);
    return knexConn;
}

export { connect };
