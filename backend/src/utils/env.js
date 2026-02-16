const getJwtSecret = () => {
  const raw = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || '';
  const secret = String(raw).trim();
  return secret.length > 0 ? secret : null;
};

module.exports = { getJwtSecret };
