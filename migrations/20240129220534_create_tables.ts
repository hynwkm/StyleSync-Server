import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("user", (table) => {
            table.increments("id").primary();
            table.string("username").notNullable().unique();
            table.string("email").notNullable().unique();
            table.string("password").notNullable();
            table.date("dob");
            table.string("gender");
            table.integer("height");
            table.integer("weight");
            table.float("rating");
            table.integer("budget");
            table.text("bio");
            table.string("profile_pic");
            table.boolean("profile_visibility").defaultTo(true);
        })
        .createTable("outfit", (table) => {
            table.increments("id").primary();
            table.integer("user_id").unsigned().notNullable();
            table.foreign("user_id").references("user.id");
            table.timestamp("upload_datetime").defaultTo(knex.fn.now());
            table.string("outfit_pic_link").notNullable();
        })
        .createTable("clothing_item", (table) => {
            table.increments("id").primary();
            table.integer("outfit_id").unsigned().notNullable();
            table.foreign("outfit_id").references("outfit.id");
            table.string("type").notNullable();
            table.string("color").notNullable();
            table.float("rating");
            table.decimal("price", 10, 2); // Assuming a maximum of 10 digits with 2 decimal places
            table.string("purchase_link");
            table.string("image_url");
        });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTable("clothing_item")
        .dropTable("outfit")
        .dropTable("user");
}
