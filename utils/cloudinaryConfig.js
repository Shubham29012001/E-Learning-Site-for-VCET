const cloudinary = require('cloudinary').v2;
const api_key = require('../config/config');

cloudinary.config({
    cloud_name: api_key.cloudinaryCloudName,
    api_key: api_key.cloudinaryKey,
    api_secret: api_key.cloudinarySecretKey,
    secure: true
});

module.exports = cloudinary;

