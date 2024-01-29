import clothingItemsData from "../seed-data/clothing_items";
import outfitsData from "../seed-data/outfits";
import usersData from "../seed-data/users";

exports.seed = async function (knex) {
    await knex("user").del();
    await knex("clothing_item").del();
    await knex("outfit").del();
    await knex("user").insert(usersData);
    await knex("clothing_item").insert(clothingItemsData);
    await knex("outfit").insert(outfitsData);
};
