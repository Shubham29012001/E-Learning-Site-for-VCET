// sendgrid key
exports.Sendgrid = process.env.SENDGRID_KEY;

// mongo database
exports.mongo = process.env.MONGO_DATABASE;

// jwt authentication
exports.accessToken = process.env.ACCESS_TOKEN_SECRET;
exports.refereshToken = process.env.REFRESH_TOKEN_SECRET;

exports.accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
exports.refereshTokenLife = process.env.REFRESH_TOKEN_LIFE;

// google auth
exports.googleAuth = process.env.OAuth2Client;

// Youtube API Key
exports.youtubeAPI = process.env.GOOGLE_API_KEY;

// Redis Configuration
exports.redisHost = process.env.REDIS_HOST;
exports.redisPort = process.env.REDIS_PORT;
exports.redisPassword = process.env.REDIS_PASSWORD;