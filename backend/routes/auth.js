var express = require('express');
var router = express.Router();
const authCtrl = require('../controllers/auth');
/* GET users listing. */
router.route('/login')
  .post(authCtrl.signIn);

router.route('/signup')
  .post(authCtrl.signUp);

module.exports = router;
