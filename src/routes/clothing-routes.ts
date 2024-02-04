import express from "express";
import * as clothingController from "../controllers/clothing-controller";

const router = express.Router();
router.route("/:outfitId").get(clothingController.getOneClothing);

export default router;
