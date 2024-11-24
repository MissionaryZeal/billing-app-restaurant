const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
let db = new sqlite3.Database("billing_app.db");

function initDatabase() {
    db.serialize(() => {
        // Create sub_categories table
        db.run(`
            CREATE TABLE IF NOT EXISTS sub_categories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )
        `);

        // Create categories table
        db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                sub_categories TEXT
            )
        `);

        // Create menus table
        db.run(`
            CREATE TABLE IF NOT EXISTS menus (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                category_id INTEGER NOT NULL,
                sub_category_id INTEGER,
                FOREIGN KEY (category_id) REFERENCES categories(id),
                FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id)
            )
        `);

        console.log("Database tables created or already exist.");

        // Insert initial data if not already present
        db.get("SELECT COUNT(*) AS count FROM categories", (err, row) => {
            if (err) {
                console.error("Error checking category data:", err);
                return;
            }
            if (row.count === 0) {
                insertInitialData();
            }
        });
    });
}

function insertInitialData() {
    const subCategories = JSON.parse(
        fs.readFileSync(path.join(__dirname, "sub_categories.json"), "utf8")
    );

    const categories = JSON.parse(
        fs.readFileSync(path.join(__dirname, "categories.json"), "utf8")
    );

    const menus = JSON.parse(
        fs.readFileSync(path.join(__dirname, "menus.json"), "utf8")
    );

    // Insert into sub_categories
    const subCategoryStmt = db.prepare(
        "INSERT INTO sub_categories (id, name) VALUES (?, ?)"
    );
    subCategories.forEach((subCategory) => {
        subCategoryStmt.run(subCategory.id, subCategory.name);
    });
    subCategoryStmt.finalize();

    // Insert into categories
    const categoryStmt = db.prepare(
        "INSERT INTO categories (id, name, sub_categories) VALUES (?, ?, ?)"
    );
    categories.forEach((category) => {
        categoryStmt.run(category.id, category.name, category.sub_categories);
    });
    categoryStmt.finalize();

    // Insert into menus
    const menuStmt = db.prepare(
        "INSERT INTO menus (name, price, category_id, sub_category_id) VALUES (?, ?, ?, ?)"
    );
    menus.forEach((menu) => {
        menuStmt.run(
            menu.name,
            menu.price,
            menu.category_id,
            menu.sub_category_id
        );
    });
    menuStmt.finalize();

    console.log("Initial data inserted.");
}

module.exports = { initDatabase };
