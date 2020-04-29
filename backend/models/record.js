const Joi = require('joi');
const mongoose = require('mongoose');
Joi.objectId = require('joi-objectid')(Joi);

//user schema
const RecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true
	},
	hour: {
    type: Number,
    default: 1,
    min: [1, 'Hour should be begger than 0hr'],
    max: [24, 'Hour should be less than 24hr'],

  },
  note: {
    type: String,
    default: '',
  },
});

const validateRecord = (record) => {
	const schema = {
    date: Joi.date().required().default(Date.now()),
    hour: Joi.number().required().min(1).max(24).default(0),
    note: Joi.string().optional().default('')
	};

	return Joi.validate(record, schema);
}

const validateUpdateRecord = (record) => {
	const schema = {
    date: Joi.date().optional(),
    hour: Joi.number().optional().min(1).max(24),
    note: Joi.string().optional(),
	};

	return Joi.validate(record, schema);
}

const Record = mongoose.model('Record', RecordSchema);

exports.Record = Record;
exports.validate = validateRecord;
exports.validateUpdate = validateUpdateRecord;