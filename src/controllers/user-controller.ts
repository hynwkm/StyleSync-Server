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
            "profile_pic"
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting users");
    }
};

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
        const { username, height, weight, rating, budget, profile_pic } =
            req.body;
        const data = await db("user")
            .where({ email })
            .update({ username, height, weight, rating, budget, profile_pic });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting profile");
    }
};
