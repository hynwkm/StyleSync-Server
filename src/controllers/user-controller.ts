import { Request, Response } from "express";
import { Knex } from "knex";
import User from "../models/users.js";
import findSimilarUsers from "../utils/similarityCalculator.js";

export const getAllUsers =
    (db: Knex) => async (req: Request, res: Response) => {
        try {
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
                .where({ profile_visibility: 1 })
                .orderBy("rating", "desc");
            res.status(200).json(data);
        } catch (error) {
            res.status(500).send(req);
        }
    };

export const getOneUser = (db: Knex) => async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const data = await db("user")
            .select(
                "id",
                "email",
                "profile_visibility",
                "username",
                "height",
                "weight",
                "rating",
                "budget",
                "profile_pic",
                "dob",
                "gender",
                "bio"
            )
            .where({ id: userId })
            .first();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllOutfits =
    (db: Knex) => async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const data = await db("outfit")
                .select("outfit.id", "outfit_pic_link")
                .where({ user_id: userId })
                .orderBy("upload_datetime", "desc");
            res.status(200).json(data);
        } catch (error) {
            res.status(500).send(error);
        }
    };

export const getAllUsersSorted =
    (db: Knex) =>
    async (
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

            let allUsers = await db("user")
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
                .where({ profile_visibility: 1 });
            if (loggedInUser.gender !== null) {
                if (loggedInUser.gender) {
                    allUsers = allUsers.filter(
                        (user) => user.gender === loggedInUser.gender
                    );
                }
            }
            let sortedUsers = findSimilarUsers(loggedInUser, allUsers);
            sortedUsers = sortedUsers.filter(
                (person) => person[0].id !== loggedInUser.id
            );
            res.status(200).json(sortedUsers);
        } catch (error) {
            res.status(500).send(req);
        }
    };
