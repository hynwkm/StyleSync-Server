// import dotenv from "dotenv";
// import knex, { Knex } from "knex"; // Import knex and Knex type

// dotenv.config();

// const dbUri =
//     process.env.JAWSDB_URL ||
//     "mysql://k9xeon0jxzwi4r2t:mfuola1ks3k4wsv4@s0znzigqvfehvff5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/p4dfvgl9vqdimbi6";
// const dbConfig = new URL(dbUri);

// let knexConn: Knex;
// async function connect() {
//     const connectionConfig = {
//         client: "mysql2",
//         connection: {
//             host: process.env.DB_HOST,
//             database: process.env.DB_NAME,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             charset: "utf8",
//         },
//         migrations: {
//             extension: "ts",
//             tableName: "stylesync",
//             directory: "./migrations",
//         },
//     };

//     knexConn = knex(connectionConfig);
//     return knexConn;
// }

// export { connect };

import dotenv from "dotenv";
import knex, { Knex } from "knex"; // Correctly importing knex and the Knex type

dotenv.config();

interface DBConfig {
    host: string;
    port?: number; // Port is optional since it might not be specified in the URL
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
            port: dbUrl.port ? parseInt(dbUrl.port) : undefined, // Convert port to a number, if present
            user: dbUrl.username,
            password: dbUrl.password,
            database: dbUrl.pathname.slice(1), // Remove the leading slash of the pathname
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
