import express from "express";
import * as userController from "../controllers/user-controller";
import authorize from "../middlewares/authorize";

const router = express.Router();
router.route("/loggedin").get(authorize, userController.getAllUsersSorted);

router.route("/").get(userController.getAllUsers);

router.route("/:userId").get(userController.getOneUser);

router.route("/:userId/outfits").get(userController.getAllOutfits);

export default router;
