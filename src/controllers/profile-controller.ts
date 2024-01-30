import { Request, Response } from "express";
import knex from "knex";

import knexConfig from "../../knexfile";

const db = knex(knexConfig);

export const getProfile = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const data = await db("user")
            .select(
                "id",
                "username",
                "email",
                "height",
                "weight",
                "rating",
                "budget",
                "profile_pic"
            )
            .where({ email });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting profile");
    }
};

export const editProfile = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const {
            username,
            height,
            weight,
            rating,
            budget,
            profile_pic,
            dob,
            gender,
            bio,
        } = req.body;
        const data = await db("user").where({ email }).update({
            username,
            height,
            weight,
            rating,
            budget,
            profile_pic,
            dob,
            gender,
            bio,
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting profile");
    }
};

export const getOutfits = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const data = await db("user")
            .join("outfit", { "user.id": "outfit.user_id" })
            .select("outfit.id", "outfit.outfit_pic_link")
            .where({ email });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error in getting outfits");
    }
};

export const uploadOutfit = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const { outfit_pic_link } = req.body;

        const user = await db("user").select("id").where({ email }).first();
        const data = await db("outfit").insert({
            user_id: user.id,
            outfit_pic_link,
        });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error in getting outfits");
    }
};

export const editOutfit = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const { id, outfit_pic_link } = req.body;

        const user = await db("user").select("id").where({ email }).first();
        const data = await db("outfit").where({ user_id: user.id, id }).update({
            outfit_pic_link,
        });
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error in getting outfits");
    }
};

export const deleteOutfit = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const { id } = req.body;

        const user = await db("user").select("id").where({ email }).first();
        const outfit = await db("outfit")
            .select("id")
            .where({ user_id: user.id, id })
            .first();
        await db("clothing_item").where({ outfit_id: outfit.id }).del();
        await db("outfit").where({ id: outfit.id }).del();

        res.status(200).send("Outfit deleted Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error in getting outfits");
    }
};
