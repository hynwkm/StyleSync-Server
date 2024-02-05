// knexfile.d.ts

import { Knex } from "knex";

const config: Knex.Config = {
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

export = config;
