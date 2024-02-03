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
exports.deleteOutfit = exports.editOutfit = exports.uploadOutfit = exports.getOutfits = exports.editProfile = exports.getProfile = void 0;
const form_data_1 = __importDefault(require("form-data"));
const knex_1 = __importDefault(require("knex"));
const openai_1 = __importDefault(require("openai"));
const axios_1 = __importDefault(require("axios"));
const knexfile_1 = __importDefault(require("../../knexfile"));
const db = (0, knex_1.default)(knexfile_1.default);
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const IMG_API_URL = process.env.IMG_API_URL || "https://freeimage.host/api/1/upload";
const IMG_API_KEY = process.env.IMG_API_KEY || "6d207e02198a847aa98d0a2a901485a5";
function identifyClothing(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                // {
                //     role: "system",
                //     content:
                //         "List each visible article of clothing by its descriptive name only, suitable as a search term.",
                // },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Name each clothing item visible, one by one.",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url,
                                detail: "low",
                            },
                        },
                    ],
                },
            ],
        });
        console.log(response.choices[0].message);
    });
}
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email } = (_a = req.decoded) !== null && _a !== void 0 ? _a : {};
        const data = yield db("user")
            .select("id", "username", "email", "height", "weight", "rating", "budget", "profile_pic", "dob", "gender", "bio", "profile_visibility")
            .where({ email })
            .first();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send("Server error in getting profile");
    }
});
exports.getProfile = getProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { email } = (_b = req.decoded) !== null && _b !== void 0 ? _b : {};
        const { username, height, weight, rating, budget, profile_pic, dob, gender, bio, profile_visibility, } = req.body;
        if (profile_pic) {
            const formData = new form_data_1.default();
            formData.append("key", IMG_API_KEY);
            formData.append("action", "upload");
            const base64ImageContent = profile_pic.replace(/^data:image\/\w+;base64,/, "");
            formData.append("source", base64ImageContent);
            formData.append("format", "json");
            const response = yield axios_1.default.post(IMG_API_URL, formData, {
                headers: Object.assign({}, formData.getHeaders()),
            });
            const image_url = response.data.image.url;
            const previousImage = yield db("user")
                .select("profile_pic")
                .where({ email })
                .first();
            yield db("user")
                .where({ email })
                .update({
                username,
                height,
                weight,
                rating,
                budget,
                profile_pic: image_url,
                dob: new Date(dob).toLocaleDateString("en-CA", {
                    // Using Canadian locale as an example to get YYYY-MM-DD format
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }),
                gender,
                bio,
                profile_visibility,
            });
            // const user = await db("user").select("id").where({ email }).first();
            // if (previousImage.profile_pic !== image_url) {
            //     await db("outfit").insert({
            //         user_id: user.id,
            //         outfit_pic_link: image_url,
            //     });
            // }
        }
        else {
            yield db("user").where({ email }).update({
                username,
                height,
                weight,
                rating,
                budget,
                dob,
                gender,
                bio,
                profile_visibility,
            });
        }
        const updatedUser = yield db("user").where({ email }).first();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server error in getting profile");
    }
});
exports.editProfile = editProfile;
const getOutfits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { email } = (_c = req.decoded) !== null && _c !== void 0 ? _c : {};
        const data = yield db("user")
            .join("outfit", { "user.id": "outfit.user_id" })
            .select("outfit.id", "outfit.outfit_pic_link")
            .where({ email });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send("Server error in getting outfits");
    }
});
exports.getOutfits = getOutfits;
const uploadOutfit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { email } = (_d = req.decoded) !== null && _d !== void 0 ? _d : {};
        const { outfit_pic_link } = req.body;
        const user = yield db("user").select("id").where({ email }).first();
        const data = yield db("outfit").insert({
            user_id: user.id,
            outfit_pic_link,
        });
        identifyClothing(outfit_pic_link);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send("Server error in getting outfits");
    }
});
exports.uploadOutfit = uploadOutfit;
const editOutfit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { email } = (_e = req.decoded) !== null && _e !== void 0 ? _e : {};
        const { id, outfit_pic_link } = req.body;
        const user = yield db("user").select("id").where({ email }).first();
        const data = yield db("outfit").where({ user_id: user.id, id }).update({
            outfit_pic_link,
        });
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).send("Server error in getting outfits");
    }
});
exports.editOutfit = editOutfit;
const deleteOutfit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const { email } = (_f = req.decoded) !== null && _f !== void 0 ? _f : {};
        const { id } = req.body;
        const user = yield db("user").select("id").where({ email }).first();
        const outfit = yield db("outfit")
            .select("id")
            .where({ user_id: user.id, id })
            .first();
        yield db("clothing_item").where({ outfit_id: outfit.id }).del();
        yield db("outfit").where({ id: outfit.id }).del();
        res.status(200).send("Outfit deleted Successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error in getting outfits");
    }
});
exports.deleteOutfit = deleteOutfit;
