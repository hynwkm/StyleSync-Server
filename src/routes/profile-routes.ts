import express from "express";
import { Knex } from "knex";
import * as favoritesController from "../controllers/favorites-controller.js";
import * as profileController from "../controllers/profile-controller.js";
import authorize from "../middlewares/authorize.js";

export default function profileRoutes(db: Knex) {
    const router = express.Router();

    router
        .route("/")
        .get(authorize, profileController.getProfile(db))
        .put(authorize, profileController.editProfile(db));

    router
        .route("/outfits")
        .get(authorize, profileController.getOutfits(db))
        .post(authorize, profileController.uploadOutfit(db))
        .put(authorize, profileController.editOutfit(db))
        .delete(authorize, profileController.deleteOutfit(db));

    router
        .route("/favorite")
        .get(authorize, favoritesController.getAllFavorites(db));

    router
        .route("/favorite/:outfitId")
        .post(authorize, favoritesController.addFavorite(db))
        .delete(authorize, favoritesController.deleteFavorite(db));

    return router;
}
