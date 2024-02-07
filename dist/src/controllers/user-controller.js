var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import findSimilarUsers from "../utils/similarityCalculator.js";
export const getAllUsers = (db) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where({ profile_visibility: 1 })
            .orderBy("rating", "desc");
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send(req);
    }
});
export const getOneUser = (db) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
export const getAllOutfits = (db) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield db("outfit")
            .select("outfit.id", "outfit_pic_link")
            .where({ user_id: userId })
            .orderBy("upload_datetime", "desc");
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
export const getAllUsersSorted = (db) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = (_a = req.decoded) !== null && _a !== void 0 ? _a : {};
        const loggedInUser = yield db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where({ email })
            .first();
        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found." });
        }
        let query = db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio")
            .where("profile_visibility", 1)
            .andWhere("id", "!=", loggedInUser.id);
        if (loggedInUser.gender != null && loggedInUser.gender !== "") {
            query = query.andWhere("gender", loggedInUser.gender);
        }
        let allUsers = yield query;
        let sortedUsers = findSimilarUsers(loggedInUser, allUsers);
        res.status(200).json(sortedUsers);
    }
    catch (error) {
        res.status(500).send(req);
    }
});
