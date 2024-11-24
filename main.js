// main.js
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");
const { initDatabase } = require("./database/database");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("billing_app.db");
require("dotenv").config();

let mainWindow;
const isDevelopment = process.env.NODE_ENV === "development";
app.whenReady().then(() => {
    initDatabase();
    if (isDevelopment) {
        console.log("Development mode: Application menu is visible.");
    } else {
        console.log("Production mode: Application menu is hidden.");
        Menu.setApplicationMenu(null);
    }
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        maximizable: true,
        autoHideMenuBar: false,
        icon: path.join(__dirname, "assets", "icon-green.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    mainWindow.loadFile("index.html");
});

ipcMain.handle("fetchCategoriesWithMenus", async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                c.id AS category_id, 
                c.name AS category_name, 
                sc.id AS sub_category_id, 
                sc.name AS sub_category_name, 
                m.id AS menu_id, 
                m.name AS menu_name, 
                m.price AS menu_price
            FROM categories c
            LEFT JOIN menus m ON c.id = m.category_id
            LEFT JOIN sub_categories sc ON m.sub_category_id = sc.id
            ORDER BY c.id, sc.id, m.id
        `;

        db.all(query, (err, rows) => {
            if (err) {
                console.error("Error fetching categories and menus:", err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});
