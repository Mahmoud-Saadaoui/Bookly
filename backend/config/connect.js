const mongoose = require("mongoose")
const logger = require('../utils/logger');

// Note: mongoose's global `sanitizeFilter` option is intentionally NOT enabled.
// It wraps every filter value in `$eq` (including server-built ones), which
// breaks legitimate operator queries ($in, $ne, $lt, ...). NoSQL operator
// injection from user input is handled by `middlewares/sanitizeRequest.js`.

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
