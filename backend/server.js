const express = require("express");
const dbConnect = require("./config/connect");
const cors = require("cors");
const dotenv = require("dotenv");
const { httpLogger } = require("./middlewares/httpLogger");
const { requestId } = require("./middlewares/requestId");
const logger = require("./utils/logger");

dotenv.config();

// connection to db
dbConnect();

// init app
const app = express();

// Generate request ID middleware
app.use(requestId);

// HTTP logging middleware
app.use(httpLogger);

// middlewares
app.use(express.json());

// CORS configuration:
// Only allow requests from trusted frontend domains defined in the .env file.
// This includes both the local development domain and the production domain (e.g., Vercel).
// Requests from tools like Postman (which have no origin) are also allowed for convenience.
// This improves security by rejecting requests from unknown origins.
const allowedOrigins = [
  process.env.CLIENT_DEVELOPMENT_DOMAIN,
  process.env.CLIENT_PRODUCTION_DOMAIN,
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// routes
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/books', require('./routes/bookRoute'));
app.use('/api/favoriteList', require('./routes/favoritesRoute'));
app.use('/api/loans', require('./routes/loanRoute'));

// Health check endpoints
app.use('/health', require('./routes/healthRoute'));

// error handling middleware (must be after routes)
const { notFound, errorHandler } = require('./middlewares/errorHandler');
app.use(notFound);
app.use(errorHandler);

// running the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server Is Running in ${process.env.NODE_ENV || 'development'} Mode on Port ${PORT}`);
});

