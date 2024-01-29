import express from "express";
import knex from "../../knexfile.js";
const router = express.Router();


router.route("/").get(async(_req,res)=>{
    try {
        const data = await knex.select("id","username","email","height","weight","rating","budget","profile_pic");
        res.status(200).json(data);    
    } catch (error) {
        res.status(500).send("Server error in getting users");
    }
})

router.route("/:userId")

export default router;