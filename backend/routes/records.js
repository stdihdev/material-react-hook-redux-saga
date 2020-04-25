const express = require('express');
const router = express.Router();
const Roles = require('../constants/role');
const recordCtrl = require('../controllers/records');
const permissions = require('../helper/permissions');

router.use(permissions.canModifyRecord([Roles.ADMIN, Roles.USER]));

// Get record list and create one
router.route('/')
  .get(recordCtrl.list)
  .post(recordCtrl.create);

// get, update, remove a record by id.
router.route('/:id')
  .get(recordCtrl.read)
  .put(recordCtrl.update)
  .delete(recordCtrl.remove);

// export html

// get record by id.
router.param('id', recordCtrl.getRecordByID);

module.exports = router;
