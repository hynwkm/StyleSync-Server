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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authorize(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(401).send("Unauthorized");
            }
            const token = authorization.split(" ")[1];
            const decoded = yield jsonwebtoken_1.default.verify(token, (_a = process.env.SECRET_KEY) !== null && _a !== void 0 ? _a : "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857");
            // @ts-ignore
            req.decoded = decoded;
            next();
        }
        catch (error) {
            res.status(401).send("Unauthorized");
        }
    });
}
exports.default = authorize;
