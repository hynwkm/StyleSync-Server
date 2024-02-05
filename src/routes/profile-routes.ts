import express from "express";
import * as favoritesController from "../controllers/favorites-controller";
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

router.route("/favorite").get(authorize, favoritesController.getAllFavorites);

router
    .route("/favorite/:outfitId")
    .post(authorize, favoritesController.addFavorite)
    .delete(authorize, favoritesController.deleteFavorite);

export default router;
