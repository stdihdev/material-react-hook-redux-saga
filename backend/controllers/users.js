const { User, validate, validateUpdate } = require("../models/user");
const { Record } = require('../models/record');
const { canModifyUser } = require('../helper/permissions');
const Roles = require('../constants/role');

function read(req, res, next) {
  res.json(req.userModel);
}

async function list(req, res, next) {
  try {
    const { page = 0, rowsPerPage = 10} = req.query;
    const where= {_id: {$ne: req.user._id}, role: {$lte: req.user.role }};


    const users = await User
      .find(where)
      .skip(page * rowsPerPage)
      .limit(parseInt(rowsPerPage))
      .select('-password');
    const count = await User.countDocuments(where);

    res.json({users, count});

  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let exist = await User.findOne({email: req.body.email});
    if (exist) return res.status(400).send("User already registered.");

    if(req.user.role === Roles.MANAGER && req.body.role === Roles.ADMIN){
      return res.status(403).send("Permission denied. You are not able to create admin role.");
    }
  
    const user = new User(req.body);
    const newUser = await user.save();
    res.json(newUser);

  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let exist = await User.findOne({email: req.body.email, _id: { $ne: req.userModel._id}});
    if (exist) return res.status(400).send("User already registered.");

    if(req.user.role === Roles.MANAGER && req.body.role === Roles.ADMIN){
      return res.status(403).send("Permission denied. You are not able to read/edit admin role.");
    }

    Object.assign(req.userModel, req.body);

    const updatedUser = await req.userModel.save();
    res.json(updatedUser);

  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  await Record.remove({user: req.userModel._id})
  await req.userModel.remove();
  res.json({id: req.userModel._id});
}

async function getUserById(req, res, next, id) {
  try {
    const user = await User.findById(id);
  
    if(!user) {
      return res.status(404).send('User not found');
    }

    if(!canModifyUser(req.user, user)) {
      return res.status(403).send('Permission denied. You are not able to read/edit this user.')
    }

    req.userModel = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  update,
  read,
  list,
  remove,
  getUserById,
};