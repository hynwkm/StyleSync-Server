import express from "express";
import * as userController from "../controllers/user-controller.js";
import authorize from "../middlewares/authorize.js";
export default function userRoutes(db) {
    const router = express.Router();
    router
        .route("/loggedin")
        .get(authorize, userController.getAllUsersSorted(db));
    router.route("/").get(userController.getAllUsers(db));
    router.route("/:userId").get(userController.getOneUser(db));
    router.route("/:userId/outfits").get(userController.getAllOutfits(db));
    return router;
}
