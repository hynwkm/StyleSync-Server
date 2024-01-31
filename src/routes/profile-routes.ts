import express from "express";
import * as profileController from "../controllers/profile-controller";
import authorize from "../middlewares/authorize";

const router = express.Router();

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
