const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
/* User signin . */
router.route('/login')
  .post(authCtrl.signIn);
// user sign up
router.route('/signup')
  .post(authCtrl.signUp);

module.exports = router;
