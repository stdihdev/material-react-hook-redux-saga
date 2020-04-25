const express = require('express');
const router = express.Router();
const authRoute = require('./auth');
const userRoute = require('./users');
const recordRoute = require('./records');
const authMiddleware = require('../middleware/auth');

router.use('/auth', authRoute);
router.use('/users', authMiddleware, userRoute);
router.use('/records', authMiddleware, recordRoute);

module.exports = router;
