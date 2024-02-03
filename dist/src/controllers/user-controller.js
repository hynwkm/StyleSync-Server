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
exports.getAllUsersSorted = exports.getAllOutfits = exports.getOneUser = exports.getAllUsers = void 0;
const knex_1 = __importDefault(require("knex"));
const similarityCalculator_1 = __importDefault(require("../utils/similarityCalculator"));
const knexfile_1 = __importDefault(require("../../knexfile"));
const db = (0, knex_1.default)(knexfile_1.default);
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where({ profile_visibility: 1 });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send("Server error in getting users");
    }
});
exports.getAllUsers = getAllUsers;
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield db("user")
            .select("id", "email", "profile_visibility", "username", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where({ id: userId })
            .first();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getOneUser = getOneUser;
const getAllOutfits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield db("outfit")
            .select("outfit.id", "outfit_pic_link")
            .where({ user_id: userId });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAllOutfits = getAllOutfits;
const getAllUsersSorted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = (_a = req.decoded) !== null && _a !== void 0 ? _a : {};
        const loggedInUser = yield db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where({ email })
            .first();
        let allUsers = yield db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where({ profile_visibility: 1 });
        if (loggedInUser.gender !== null) {
            if (loggedInUser.gender) {
                allUsers = allUsers.filter((user) => user.gender === loggedInUser.gender);
            }
        }
        let sortedUsers = (0, similarityCalculator_1.default)(loggedInUser, allUsers);
        sortedUsers = sortedUsers.filter((person) => person[0].id !== loggedInUser.id);
        res.status(200).json(sortedUsers);
    }
    catch (error) {
        res.status(500).send("Server error in getting sorted users");
    }
});
exports.getAllUsersSorted = getAllUsersSorted;
