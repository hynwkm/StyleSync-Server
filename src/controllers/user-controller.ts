import { Request, Response } from "express";
import knex from "knex";

import knexConfig from "../../knexfile";

const db = knex(knexConfig);

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const data = await db("user").select(
            "id",
            "username",
            "email",
            "height",
            "weight",
            "rating",
            "budget",
            "profile_pic",
            "dob",
            "gender",
            "bio"
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting users");
    }
};

export const getOneUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params;
        const data = await db("user")
            .select(
                "id",
                "username",
                "email",
                "height",
                "weight",
                "rating",
                "budget",
                "profile_pic",
                "dob",
                "gender",
                "bio"
            )
            .where({ id: userId });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting user");
    }
};

export const getAllOutfits = async (req: Request, res: Response) => {
    try {
        const userId = req.params;
        const data = await db("user")
            .join("outfit", { id: `outfit.id` })
            .select(
                "outfit.id",
                "username",
                "email",
                "height",
                "weight",
                "rating",
                "budget",
                "profile_pic"
            )
            .where({ id: userId });
        res.status(200).json(data);
    } catch (error) {}
};
