import express from "express";
import { Knex } from "knex";
import * as clothingController from "../controllers/clothing-controller.js";

export default function clothingRoutes(db: Knex) {
    const router = express.Router();
    router.route("/:outfitId").get(clothingController.getOneClothing(db));
    return router;
}
