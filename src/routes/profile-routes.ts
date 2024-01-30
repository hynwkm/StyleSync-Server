import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as profileController from "../controllers/profile-controller";

const router = express.Router();

async function authorize(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).send("Unauthorized");
        }
        const token = authorization.split(" ")[1];
        const decoded = await jwt.verify(
            token,
            process.env.SECRET_KEY ??
                "4217a82f82f0c3133dfc9557eb01171452f569ac3ac418956a2de8d9ea977857"
        );
        // @ts-ignore
        req.decoded = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
    }
}
router
    .route("/")
    .get(authorize, profileController.getProfile)
    .put(authorize, profileController.editProfile);

router
    .route("/outfits")
    .get(authorize, profileController.getOutfits)
    .post(authorize, profileController.uploadOutfit)
    .put(authorize, profileController.editOutfit)
    .delete(authorize, profileController.deleteOutfit);

export default router;
