var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Import statements
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import pkg from "validator";
const { isEmail, isStrongPassword } = pkg;
import { connect } from "../knexfile.js";
// Routes
// Middleware
// Routes
import clothingRoutes from "./routes/clothing-routes.js";
import profileRoutes from "./routes/profile-routes.js";
import userRoutes from "./routes/user-routes.js";
// Constants
const saltRounds = 10;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = express();
        app.use(cors());
        app.use(express.static("./data/public"));
        app.use(bodyParser.json({ limit: "10mb" }));
        app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
        const db = yield connect();
        app.use("/api/user", userRoutes(db));
        app.use("/api/profile", profileRoutes(db));
        app.use("/api/clothing", clothingRoutes(db));
        app.post("/api/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                const { username, password, email } = req.body;
                if (!(username.trim() &&
                    email.trim() &&
                    isEmail(email) &&
                    isStrongPassword(password))) {
                    return res
                        .status(400)
                        .send("Please enter a valid username, email, and strong password");
                }
                const existingUser = yield db("user")
                    .select("id")
                    .where({ email })
                    .first();
                if (existingUser) {
                    return res.status(400).send("Email is already taken");
                }
                // Hash the password
                const hashedPassword = yield bcrypt.hash(password, saltRounds);
                // Insert user into the database
                yield db("user").insert({
                    username,
                    password: hashedPassword,
                    email,
                });
                const token = jwt.sign({ email, username }, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857");
                res.status(201).json({ token });
            }
            catch (error) {
                res.status(500).send("Internal Server Error during sign up");
            }
        }));
        app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const { email, password } = req.body;
            try {
                // Retrieve user from the database
                const user = yield db("user")
                    .select("id", "username", "password", "email")
                    .where({ email })
                    .first();
                if (!user || !(yield bcrypt.compare(password, user.password))) {
                    return res
                        .status(401)
                        .send("Username and password do not match");
                }
                // Generate and send JWT token
                const token = jwt.sign({ email: user.email, username: user.username }, (_b = process.env.SECRET_KEY) !== null && _b !== void 0 ? _b : "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857");
                res.status(201).json({ token });
            }
            catch (error) {
                console.log(error);
                res.status(500).send("Internal Server Error during login");
            }
        }));
        app.get("/", (_req, res) => {
            res.status(200).send("Available Endpoints: /api/login, /api/signup, /api/user, /api/profile");
        });
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Listening on port ${process.env.PORT || 3000}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
