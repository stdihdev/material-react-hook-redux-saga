var express = require('express');
var router = express.Router();
const authRoute = require('./auth');
const userRoute = require('./users');
const recordRoute = require('./records');

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/records', recordRoute);

module.exports = router;
