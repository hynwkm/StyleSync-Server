import { Request, Response } from "express";
import knex from "knex";

import knexConfig from "../../knexfile";

const db = knex(knexConfig);

export const getOneClothing = async (req: Request, res: Response) => {
    try {
        const { outfitId } = req.params;
        const data = await db("clothing_item")
            .select(
                "id",
                "outfit_id",
                "type",
                "style",
                "color",
                "rating",
                "price",
                "purchase_link",
                "image_url"
            )
            .where({ outfit_id: outfitId });
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "An error occurred while fetching the data.",
        });
    }
};
