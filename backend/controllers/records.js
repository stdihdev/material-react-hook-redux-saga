const { Record, validate, validateUpdate } = require("../models/record");
const ObjectId = require('mongodb').ObjectID;
const Roles = require('../constants/role');
const { canModifyRecord } = require('../helper/permissions');

async function validateTotalHours(record) {
  let where={date: record.date, _id: {$ne: record._id}, user: record.user};

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
    const { from, to, page = 0, rowsPerPage = 10, user} = req.query;
    let where= {};
    if (req.user.role === Roles.USER || req.user.role === Roles.MANAGER) {
      where = {user: req.user._id};
    }
    if(from && to)
      where['date'] = { $gte: new Date(from), $lte: new Date(to) };
    else if(from && !to)
      where['date'] = { $gte: new Date(from) };
    else if(!from && to)
      where['date'] = { $lte: new Date(to) };

    if(user && req.user.role === Roles.ADMIN) {
      where['user'] = ObjectId(user);
    }

    const records = await Record
      .find(where)
      .skip(page * rowsPerPage)
      .limit(parseInt(rowsPerPage))
      .populate('user', '-password')
      .sort('-date');
    const count = await Record.countDocuments(where);

    res.json({records, count});

  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    if(req.user.role < Roles.ADMIN) {
      req.body.user = req.user._id;
    }

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.date = new Date(req.body.date).toLocaleDateString();
    const record = new Record(req.body);
  
    if(!await validateTotalHours(record)) {
      return res.status(400).send("Couldn't work more than 24 hours a day.");
    }

    const newRecord = await record.save();
    res.json(newRecord);

  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    if(req.user.role < Roles.ADMIN) {
      req.body.user = req.user._id;
    }
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.date = new Date(req.body.date).toLocaleDateString();
    Object.assign(req.record, req.body);

    

    if(!await validateTotalHours(req.record)) {
      return res.status(400).send("Couldn't work more than 24 hours a day.");
    }

    const updatedRecord = await await req.record.save();
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
      return res.status(403).send('Permission denied. You are not able to read/edit this record.')
    }

    req.record = record;
    next();
  } catch (error) {
    next(error);
  }
}

async function exportRecords(req, res, next) {
  try {
    const { from, to, user } = req.query;
    let where={};
    if(req.user.role < Roles.ADMIN)
      where = {user: ObjectId(req.user._id)};

    if(user && req.user.role === Roles.ADMIN) {
      where['user'] = ObjectId(user);
    }

    if(from && to)
      where['date'] = { $gte: new Date(from), $lte: new Date(to) };
    else if(from && !to)
      where['date'] = { $gte: new Date(from) };
    else if(!from && to)
      where['date'] = { $lte: new Date(to) };

    const records = await Record.aggregate([
      {
        $match: where
      },
      {
        $group: {
          _id: "$date",
          note: { $push: '$note' },
          hour: { $sum: '$hour' },
        },
      },
      {
        $sort: {_id: 1}
      },
    ]);

    res.json({records});

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
  exportRecords
};