import express from "express";
import * as userController from "../controllers/user-controller";

const router = express.Router();

router.route("/").get(userController.getAllUsers);

router.route("/:userId").get(userController.getOneUser);

router.route("/:userId/outfits").get(userController.getAllOutfits);

export default router;
