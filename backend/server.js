const express = require("express");
const dbConnect = require("./config/connect");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// connection to db
dbConnect();

// init app
const app = express();

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
app.use("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

// routes
app.use('/api/users', require('./routes/userRoute'))
app.use('/api/books', require('./routes/bookRoute'))
app.use('/api/favoriteList', require('./routes/favoritesRoute'))
app.use('/api/loans', require('./routes/loanRoute'))

// running the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server Is Running in Mode on Port ${PORT}`
  )     
);
