import { Request, Response } from "express";
import knex from "knex";

import knexConfig from "../../knexfile";

const db = knex(knexConfig);

export const getAllFavorites = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const user = await db("user").select("id").where({ email }).first();
        const data = await db("favorites").select("outfit_id").where({
            user_id: user.id,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching the data.",
        });
    }
};

export const addFavorite = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { outfitId } = req.params;
        const { email } = req.decoded ?? {};

        const user = await db("user").select("id").where({ email }).first();

        const data = await db("favorites").insert({
            user_id: user.id,
            outfit_id: outfitId,
        });
        const result = await db("favorites")
            .select("outfit_id")
            .where({ id: data[0] })
            .first();
        const favOutfitId = result ? result.outfit_id : null;
        res.status(200).json(favOutfitId);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export const deleteFavorite = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { outfitId } = req.params;
        const { email } = req.decoded ?? {};

        const user = await db("user").select("id").where({ email }).first();

        const data = await db("favorites").delete().where({
            user_id: user.id,
            outfit_id: outfitId,
        });
        if (data) {
            res.status(200).send(outfitId);
        } else {
            res.status(500).json({
                error: "An error occurred while fetching the data.",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching the data.",
        });
    }
};