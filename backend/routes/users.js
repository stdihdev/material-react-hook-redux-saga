const express = require('express');
const router = express.Router();
const Roles = require('../constants/role');
const userCtrl = require('../controllers/users');
const permissions = require('../helper/permissions');

router.use(permissions.isRole([Roles.ADMIN, Roles.MANAGER]));

// Get records listing and create one
router.route('/')
  .get(userCtrl.list)
  .post(userCtrl.create);

// get, update, remove a record by id.
router.route('/:id')
  .get(userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove);

// export html

// get record by id.
router.param('id', userCtrl.getUserById);

module.exports = router;
