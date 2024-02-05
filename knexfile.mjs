import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.JAWSDB_URL;
const dbConfig = new URL(dbUrl);

const knexConfig = {
    client: "mysql2",
    connection: {
        host: dbConfig.hostname || process.env.DB_HOST,
        database:
            dbConfig.pathname.replace("/", "") || process.env.DB_LOCAL_NAME,
        user: dbConfig.username || process.env.DB_LOCAL_USER,
        password: dbConfig.password || process.env.DB_LOCAL_PASSWORD,
        charset: "utf8",
    },
    migrations: {
        extension: "ts",
        tableName: "stylesync",
        directory: "./migrations",
    },
};

export default knexConfig;
