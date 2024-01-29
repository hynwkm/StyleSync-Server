import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import isStrongPassword from "validator";
import knex from "./knexfile.js";
import User from "./src/types/users.ts";

import userRoutes from "./src/routes/users.ts";

// middleware
const app = express();
app.use(cors());

// function authorize(req, res, next) {
//     try {
//         const { authorization } = req.headers;
//         console.log(authorization);
//         const token = authorization.split(" ")[1];
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.decoded = decoded;
//         next();
//     } catch (error) {
//         console.log(error);
//     }
// }

//endpoints for user, clothes, purchases, maybe tags?

app.use("/users", userRoutes);

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!(username.trim() && isStrongPassword(password))) {
        res.status(400).send(
            "Please enter a valid username and unique password"
        );
    }
    try {
        await knex<User>("users").insert({ username, password });
        res.status(201).json({ username, password });
    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = knex.select("id","username", "password").where({ username });
    if (!user || user.password !== password) {
        res.status(401).send("username and password do not match");
    }
    const token = jwt.sign({ username }, process.env.SECRET_KEY);
    res.status(201).json({ token });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
