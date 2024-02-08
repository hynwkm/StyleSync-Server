import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import pkg from "validator";
const { isEmail, isStrongPassword } = pkg;

import { connect } from "../knexfile.js";

import clothingRoutes from "./routes/clothing-routes.js";
import profileRoutes from "./routes/profile-routes.js";
import userRoutes from "./routes/user-routes.js";

const saltRounds = 10;

(async () => {
    try {
        const app = express();
        app.use(cors());
        app.use(express.static("./data/public"));
        app.use(bodyParser.json({ limit: "10mb" }));
        app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

        const db = await connect();

        app.use("/api/user", userRoutes(db));
        app.use("/api/profile", profileRoutes(db));
        app.use("/api/clothing", clothingRoutes(db));

        app.post("/api/signup", async (req, res) => {
            try {
                const { username, password, email } = req.body;

                if (!username.trim()) {
                    return res
                        .status(400)
                        .send("Please enter a valid username.");
                }

                if (!email.trim() || !isEmail(email)) {
                    return res
                        .status(400)
                        .send("Please enter a valid email address.");
                }

                if (!isStrongPassword(password)) {
                    return res
                        .status(400)
                        .send("Please enter a strong password.");
                }

                const existingUser = await db("user")
                    .select("id")
                    .where({ email })
                    .first();

                if (existingUser) {
                    return res.status(400).send("Email is already taken");
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, saltRounds);

                // Insert user into the database
                await db("user").insert({
                    username,
                    password: hashedPassword,
                    email,
                    profile_visibility: 0,
                });
                const token = jwt.sign(
                    { email, username },
                    process.env.SECRET_KEY ??
                        "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857"
                );
                res.status(201).json({ token });
            } catch (error) {
                res.status(500).send("Internal Server Error during sign up");
            }
        });

        app.post("/api/login", async (req, res) => {
            const { email, password } = req.body;
            try {
                // Retrieve user from the database
                const user = await db("user")
                    .select("id", "username", "password", "email")
                    .where({ email })
                    .first();

                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return res
                        .status(401)
                        .send("Username and password do not match");
                }

                // Generate and send JWT token
                const token = jwt.sign(
                    { email: user.email, username: user.username },
                    process.env.SECRET_KEY ??
                        "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857"
                );
                res.status(201).json({ token });
            } catch (error) {
                console.log(error);
                res.status(500).send("Internal Server Error during login");
            }
        });

        app.get("/", (_req, res) => {
            res.status(200).send(
                "Available Endpoints: /api/login, /api/signup, /api/user, /api/profile"
            );
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Listening on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.log(error);
    }
})();
