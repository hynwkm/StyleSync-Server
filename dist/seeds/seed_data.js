import clothingItemsData from "../database/seed-data/clothing_items";
import outfitsData from "../database/seed-data/outfits";
import usersData from "../database/seed-data/users";
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("user").del();
    await knex("outfit").del();
    await knex("clothing_item").del();
    // Inserts seed entries
    await knex("user").insert(usersData);
    await knex("outfit").insert(outfitsData);
    await knex("clothing_item").insert(clothingItemsData);
}
