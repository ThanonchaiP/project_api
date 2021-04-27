require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL:process.env.MONGODB_URL,
    DOMAIN:process.env.DOMAIN,
    JWT_SECRET:process.env.JWT_SECRET
}