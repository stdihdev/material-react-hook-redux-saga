const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
/* User signin . */
router.route('/login')
  .post(authCtrl.signIn);
// User sign up
router.route('/signup')
  .post(authCtrl.signUp);
// User update Preferred Working Hours
router.route('/update')
  .post(authMiddleware, authCtrl.updateProfile);

module.exports = router;
