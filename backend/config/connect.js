const mongoose = require("mongoose")
const logger = require('../utils/logger');

mongoose.set('sanitizeFilter', true);

const dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 45000
    });

    logger.info('Connected to MongoDB');
}

module.exports = dbConnect
