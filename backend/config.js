const dotenv = require('dotenv');

try {
  dotenv.config();
} catch (e) {
  console.log(e);
}

module.exports = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/time-management',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpires: process.env.JWT_EXPIRES || '30d',
}