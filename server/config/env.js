require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    dbPath: process.env.DB_PATH,
    schemaPath: process.env.SCHEMA,
    seedPath: process.env.SEED,
    jwtSecret: process.env.JWT_SECRET,
    avatarDir: process.env.USERS_AVATAR_DIR,
    globalIconDir: process.env.GLOBAL_ICON_DIR,
    seasonalIconDir: process.env.SEASONAL_ICON_DIR
}