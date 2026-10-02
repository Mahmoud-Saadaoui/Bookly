const requiredVariables = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const validateInteger = (name, { min, max }) => {
  if (!process.env[name]) {
    return;
  }

  const value = Number(process.env[name]);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}`);
  }
};

const validateEnv = () => {
  const missingVariables = requiredVariables.filter((name) => !process.env[name]?.trim());

  if (missingVariables.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production');
  }

  const nodeEnvironments = new Set(['development', 'test', 'production']);
  if (process.env.NODE_ENV && !nodeEnvironments.has(process.env.NODE_ENV)) {
    throw new Error('NODE_ENV must be development, test or production');
  }

  validateInteger('PORT', { min: 1, max: 65535 });
  validateInteger('TRUST_PROXY_HOPS', { min: 0, max: 10 });
  validateInteger('MONGO_MAX_POOL_SIZE', { min: 1, max: 500 });
  validateInteger('MAX_LOAN_DURATION_DAYS', { min: 1, max: 365 });
  validateInteger('MAX_REVIEWS_PER_BOOK', { min: 1, max: 10000 });
  validateInteger('MAX_FAVORITES_PER_USER', { min: 1, max: 10000 });

  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_PRODUCTION_DOMAIN?.trim()) {
    throw new Error('CLIENT_PRODUCTION_DOMAIN is required in production');
  }

  if (process.env.BCRYPT_ROUNDS) {
    const rounds = Number(process.env.BCRYPT_ROUNDS);
    if (!Number.isInteger(rounds) || rounds < 10 || rounds > 15) {
      throw new Error('BCRYPT_ROUNDS must be an integer between 10 and 15');
    }
  }
};

module.exports = { validateEnv };
