// knexfile.d.ts

import { Knex } from "knex";

const config: Knex.Config = {
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        database: process.env.DB_LOCAL_NAME,
        user: process.env.DB_LOCAL_USER,
        password: process.env.DB_LOCAL_PASSWORD,
        charset: "utf8",
    },
    migrations: {
        extension: "ts",
        tableName: "stylesync",
        directory: "./migrations",
    },
};

export = config;
