import { Request, Response } from "express";
import knex from "knex";
import User from "../models/users";
import findSimilarUsers from "../utils/similarityCalculator";

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
        const { userId } = req.params;
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
        res.status(500).send(error);
    }
};

export const getAllOutfits = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const data = await db("outfit")
            .select("outfit.id", "outfit_pic_link")
            .where({ user_id: userId });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllUsersSorted = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const loggedInUser: User = await db("user")
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
            .where({ email })
            .first();

        const allUsers = await db("user")
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
            .where({ gender: loggedInUser.gender });

        const sortedUsers = findSimilarUsers(loggedInUser, allUsers);

        res.status(200).json(sortedUsers.slice(1));
    } catch (error) {
        res.status(500).send("Server error in getting sorted users");
    }
};
