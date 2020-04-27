const { Record, validate, validateUpdate } = require("../models/record");
const Roles = require('../constants/role');
const { canModifyRecord } = require('../helper/permissions');

async function validateTotalHours(record) {
  let where={date: record.date, _id: {$ne: record._id}};

  const records = await Record.find(where);
  if(records.length) {
    let totalHourByDate = records.reduce((prev, cur) => {
      return prev + cur.hour;
    }, 0);
    totalHourByDate += record.hour;
    if(totalHourByDate > 24) {
      return false;
    }
  }
  return true;
}

function read(req, res, next) {
  res.json(req.record);
}

async function list(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;
    let where = {};
    if (req.user.role === Roles.USER || req.user.role === Roles.MANAGER) {
      where = {user: req.user._id};
    }

    const records = await Record.find(where).limit(limit).skip((page - 1) * limit).populate('user', '-password');
    const count = await Record.countDocuments();

    res.json({records, params: {limit, page, count}});

  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const record = new Record(req.body);
    record.user = req.user._id;
  
    if(!await validateTotalHours(record)) {
      return res.status(400).send("Worked more than 24hours!");
    }

    const newRecord = await record.save();
    res.json(newRecord);

  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const record = new Record({...req.record._doc, ...req.body});
    record._id = req.record._id;

    if(!await validateTotalHours(record)) {
      return res.status(400).send("Worked more than 24hours!");
    }

    const updatedRecord = await Record.findByIdAndUpdate(req.record._id, record, {upsert: true, useFindAndModify: false, new: true});
    res.json(updatedRecord);

  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  await req.record.remove();
  res.json({id: req.record._id});
}

async function getRecordById(req, res, next, id) {
  try {
    const record = await Record.findById(id);
  
    if(!record) {
      return res.status(404).send('Record not found');
    }

    if(!canModifyRecord(req.user, record)) {
      return res.status(403).send('You are not authorized.')
    }

    req.record = record;
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
  getRecordById,
};