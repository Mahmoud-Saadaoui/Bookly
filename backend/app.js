const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { httpLogger } = require('./middlewares/httpLogger');
const { requestId } = require('./middlewares/requestId');
const { apiLimiter } = require('./middlewares/rateLimiter');

const app = express();

app.disable('x-powered-by');

const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS) || 0;
if (trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops);
}

const normalizeOrigin = (origin) => origin?.trim().replace(/\/+$/, '');
const configuredOrigins = process.env.CLIENT_ALLOWED_ORIGINS
  ? process.env.CLIENT_ALLOWED_ORIGINS.split(',')
  : [process.env.CLIENT_DEVELOPMENT_DOMAIN, process.env.CLIENT_PRODUCTION_DOMAIN];
const allowedOrigins = [...new Set(configuredOrigins
  .map(normalizeOrigin)
  .filter(Boolean))];

app.use(helmet());
app.use(requestId);
app.use(httpLogger);
app.use(express.json({ limit: '100kb' }));
app.use(cors({
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.includes(normalizeOrigin(origin)));
  },
  // Authentication uses the Authorization header, not cookies.
  credentials: false
}));
app.use('/api', apiLimiter);

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/books', require('./routes/bookRoute'));
app.use('/api/favoriteList', require('./routes/favoritesRoute'));
app.use('/api/loans', require('./routes/loanRoute'));
app.use('/api/config', require('./routes/configRoute'));
app.use('/health', require('./routes/healthRoute'));

const { notFound, errorHandler } = require('./middlewares/errorHandler');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
