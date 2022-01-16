// src/config
const dotenv = require("dotenv");
dotenv.config();
// Exporting env variable
module.exports = {
    CLIENT_ID: process.env.CLIENT_ID_AMADEUS,
    CLIENT_SECRET: process.env.CLIENT_SECRET_AMADEUS
};