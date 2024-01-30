// Import statements
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import knex from "knex";
import { isEmail, isStrongPassword } from "validator";

import knexConfig from "../knexfile";

// Routes
import profileRoutes from "./routes/profile-routes";
import userRoutes from "./routes/user-routes";

// Constants
const saltRounds = 10;

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize knex using your configuration
const db = knex(knexConfig);

// endpoints for user, outfits, clothes (tags if possible)?

app.use("/user", userRoutes);
app.use("/profile", profileRoutes);

app.post("/signup", async (req, res) => {
    console.log(req.body);
    try {
        const { username, password, email } = req.body;

        //Validate username and password
        if (
            !(
                username.trim() &&
                email.trim() &&
                isEmail(email) &&
                isStrongPassword(password)
            )
        ) {
            return res
                .status(400)
                .send(
                    "Please enter a valid username, email, and strong password"
                );
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
        await db("user").insert({ username, password: hashedPassword, email });

        res.status(201).json({ username });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve user from the database
        const user = await db("user")
            .select("id", "username", "password", "email")
            .where({ email })
            .first();

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send("Username and password do not match");
        }

        // Generate and send JWT token
        const token = jwt.sign(
            { email: user.email, username: user.username },
            process.env.SECRET_KEY ??
                "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857"
        );
        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
});
