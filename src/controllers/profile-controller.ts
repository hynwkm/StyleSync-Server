import { Request, Response } from "express";
import FormData from "form-data";
import knex from "knex";
import OpenAI from "openai";

import axios from "axios";
import knexConfig from "../../knexfile";

const db = knex(knexConfig);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const IMG_API_URL: string =
    process.env.IMG_API_URL || "https://freeimage.host/api/1/upload";
const IMG_API_KEY: string =
    process.env.IMG_API_KEY || "6d207e02198a847aa98d0a2a901485a5";

interface ClothingItem {
    type: string;
    color: string;
    style: string;
}

async function identifyClothing(url: string): Promise<ClothingItem[]> {
    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens: 1500,
        messages: [
            {
                role: "system",
                content:
                    'Your task is to analyze a provided image and identify articles of clothing. The response should be in JSON format, mimicking a predefined schema. The schema defines each clothing item with \'type\', \'color\', and \'style\' properties. Provide the analysis for the top three most visible clothing items in the image. Your response should be structured as follows: [{"type": "string", "color": "string", "style": "string"}]. Respond with only the JSON representation of the analysis, with no additional text.',
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: 'Analyze the image and provide a JSON response detailing the top three clothing items visible, including their type, color, and style, according to the schema described. Example output for other images have been: [{"type": "jacket", "color": "black", "style": "leather"}, {"type": "shirt", "color": "white", "style": "linen button-up"}, {"type": "pants", "color": "blue", "style": "denim jeans"}].',
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url,
                        },
                    },
                ],
            },
        ],
    });

    const content = response.choices[0].message.content;
    if (content === null) {
        console.error("Received null content.");
        // Handle null content appropriately, e.g., return an empty array or throw an error
        return [];
    }
    try {
        const match = content.match(/\[.*\]/s);
        if (match) {
            const jsonString = match[0];
            const parsedResponse = JSON.parse(jsonString);
            return parsedResponse;
        } else {
            return [];
        }
        // Assuming parsedResponse is already ClothingItem[], directly return it
    } catch (error) {
        console.error("Failed to parse response:", error);
        // Return an empty array or throw an error as appropriate for your application
        return [];
    }
}

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
                "profile_pic",
                "dob",
                "gender",
                "bio",
                "profile_visibility"
            )
            .where({ email })
            .first();
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
            profile_visibility,
        } = req.body;
        if (profile_pic) {
            const formData = new FormData();
            formData.append("key", IMG_API_KEY as string);
            formData.append("action", "upload");
            const base64ImageContent = profile_pic.replace(
                /^data:image\/\w+;base64,/,
                ""
            );
            formData.append("source", base64ImageContent);
            formData.append("format", "json");
            const response = await axios.post(IMG_API_URL, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            const image_url = response.data.image.url;
            await db("user").select("profile_pic").where({ email }).first();

            await db("user")
                .where({ email })
                .update({
                    username,
                    height,
                    weight,
                    rating,
                    budget,
                    profile_pic: image_url,
                    dob: new Date(dob).toLocaleDateString("en-CA", {
                        // Using Canadian locale as an example to get YYYY-MM-DD format
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }),
                    gender,
                    bio,
                    profile_visibility,
                });
        } else {
            await db("user").where({ email }).update({
                username,
                height,
                weight,
                rating,
                budget,
                dob,
                gender,
                bio,
                profile_visibility,
            });
        }
        const updatedUser = await db("user").where({ email }).first();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
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
            .where({ email })
            .orderBy("upload_datetime", "desc");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send("Server error in getting outfits");
    }
};

function getPrice() {
    const min = 20;
    const max = 200;
    const biasedRandom = Math.sqrt(Math.random());
    // Scale the biased random number back to our desired range (min to max)
    const price = Math.floor(biasedRandom * (max - min + 1) + min) + 0.99;
    return price;
}

export const uploadOutfit = async (
    req: Request & { decoded?: { username: string; email: string } },
    res: Response
) => {
    try {
        const { email } = req.decoded ?? {};
        const { outfit_pic_link } = req.body;

        const formData = new FormData();
        formData.append("key", IMG_API_KEY as string);
        formData.append("action", "upload");
        const base64ImageContent = outfit_pic_link.replace(
            /^data:image\/\w+;base64,/,
            ""
        );
        formData.append("source", base64ImageContent);
        formData.append("format", "json");
        const response = await axios.post(IMG_API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        const image_url = response.data.image.url;

        const user = await db("user").select("id").where({ email }).first();
        const [outfitId] = await db("outfit").insert({
            user_id: user.id,
            outfit_pic_link: image_url,
        });
        const uploadedOutfit = await db("outfit")
            .select("*")
            .where({ id: outfitId })
            .first();

        const arrayOfClothing = await identifyClothing(image_url);
        try {
            await Promise.all(
                arrayOfClothing.map(async (clothing) => {
                    await db("clothing_item").insert({
                        outfit_id: outfitId,
                        type: clothing.type,
                        color: clothing.color,
                        style: clothing.style,
                        rating: 3.0,
                        price: getPrice(),
                        purchase_link: "https://example.com/product/12345",
                        image_url: "https://example.com/images/tshirt_blue.jpg",
                    });
                })
            );
        } catch (error) {
            console.error(error);
        }
        res.status(200).json(uploadedOutfit);
    } catch (error) {
        res.status(500).send(error);
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
        const result = await db.transaction(async (trx) => {
            const outfit = await trx("outfit")
                .select("id") // Assuming these are the fields you want to return
                .where({ user_id: user.id, id })
                .first();

            if (!outfit) {
                return res.status(404).json({ error: "Outfit not found" });
            }

            await trx("clothing_item").where({ outfit_id: outfit.id }).del();
            await trx("outfit").where({ id: outfit.id }).del();

            return outfit;
        });
        res.status(200).json({
            message: "Outfit deleted successfully",
            deletedOutfit: result,
        });
    } catch (error) {
        console.error("Error deleting outfit:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
