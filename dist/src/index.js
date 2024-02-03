"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import statements
const bcrypt_1 = __importDefault(require("bcrypt"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const knex_1 = __importDefault(require("knex"));
const validator_1 = require("validator");
const knexfile_1 = __importDefault(require("../knexfile"));
// Routes
const profile_routes_1 = __importDefault(require("./routes/profile-routes"));
const user_routes_1 = __importDefault(require("./routes/user-routes"));
// Constants
const saltRounds = 10;
// Middleware
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static("./data/public"));
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Initialize knex using your configuration
const db = (0, knex_1.default)(knexfile_1.default);
// endpoints for user, outfits, clothes (tags if possible)?
app.use("/api/user", user_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.post("/api/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, password, email } = req.body;
        //Validate username and password
        if (!(username.trim() &&
            email.trim() &&
            (0, validator_1.isEmail)(email) &&
            (0, validator_1.isStrongPassword)(password))) {
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
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Insert user into the database
        yield db("user").insert({ username, password: hashedPassword, email });
        const token = jsonwebtoken_1.default.sign({ email, username }, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857");
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
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).send("Username and password do not match");
        }
        // Generate and send JWT token
        const token = jsonwebtoken_1.default.sign({ email: user.email, username: user.username }, (_b = process.env.SECRET_KEY) !== null && _b !== void 0 ? _b : "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857");
        res.status(201).json({ token });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error during login");
    }
}));
app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
});
