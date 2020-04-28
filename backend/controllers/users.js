const { User, validate, validateUpdate } = require("../models/user");

function read(req, res, next) {
  res.json(req.userModel);
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({_id: {$ne: req.user._id}, role: {$lte: req.user.role }}).limit(limit).skip((page - 1) * limit).select('-');
    const count = await User.countDocuments();

    res.json({users, params: {limit, page, count}});

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

    if(req.user.role === "manager" && req.body.role === "admin"){
      return res.status(403).send("Permission denied");
    }

    Object.assign(req.userModel, req.body);

    const updatedUser = await req.userModel.save();
    res.json(updatedUser);

  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  await req.userModel.remove();
  res.json({id: req.userModel._id});
}

async function getUserById(req, res, next, id) {
  try {
    const user = await User.findById(id);
  
    if(!user) {
      return res.status(404).send('Record not found');
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