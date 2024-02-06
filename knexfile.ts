import dotenv from "dotenv";
import knex, { Knex } from "knex"; // Import knex and Knex type

dotenv.config();

let knexConn: Knex;
async function connect() {
    const connectionConfig = {
        client: "mysql2",
        connection: {
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            charset: "utf8",
        },
        migrations: {
            extension: "ts",
            tableName: "stylesync",
            directory: "./migrations",
        },
    };

    knexConn = knex(connectionConfig);
    return knexConn;
}

export { connect };
