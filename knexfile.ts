import dotenv from "dotenv";
import knex, { Knex } from "knex"; // Import knex and Knex type

dotenv.config();

const dbUri =
    process.env.JAWSDB_URL ||
    "mysql://k9xeon0jxzwi4r2t:mfuola1ks3k4wsv4@s0znzigqvfehvff5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/p4dfvgl9vqdimbi6";
const dbConfig = new URL(dbUri);

// Define your knexConfig inside an async function to connect dynamically
let knexConn: Knex; // This will hold the Knex connection object
async function connect() {
    const connectionConfig = {
        client: "mysql2",
        connection: {
            host: dbConfig.hostname || process.env.DB_HOST,
            database: dbConfig.pathname.replace("/", "") || process.env.DB_NAME,
            user: dbConfig.username || process.env.DB_USER,
            password: dbConfig.password || process.env.DB_PASSWORD,
            charset: "utf8",
        },
        migrations: {
            extension: "ts",
            tableName: "stylesync",
            directory: "./migrations",
        },
    };

    knexConn = knex(connectionConfig); // Initialize the Knex connection
    return knexConn; // Return the connection object for use
}

// Export the connect function instead of a configuration object
export { connect };
