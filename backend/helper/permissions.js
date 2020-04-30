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

function canModifyUser(user, modifyUser) {
  if(modifyUser.role <= user.role) {
    return true;
  }
  return false;
}

function canModifyRecord(user, record) {
  if(user.role === Roles.ADMIN || user._id === record.user.toString()) {
    return true;
  }
  return false;
}

module.exports = {
  isRole,
  canModifyRecord,
  canModifyUser
};
