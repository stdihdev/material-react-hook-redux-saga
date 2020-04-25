const Roles = require('../constants/role');

function isRole(roles) {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) > -1) {
      next();
      return;
    }

    res.status(401).json({ message: 'You are not authorized' });
  };
}

function canModifyRecord(user, record) {
  return () => {
    if(user.role === Roles.ADMIN || user._id === record.user.toString()) {
      return true;
    }
    return false;
  }
}

module.exports = {
  isRole,
  canModifyRecord,
};
