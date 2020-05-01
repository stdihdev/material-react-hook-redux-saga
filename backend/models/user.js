const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const ROLES = require('../constants/role');
const config = require('../config');
const bcrypt = require('bcrypt');

//user schema
const UserSchema = new mongoose.Schema({
  firstName: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 250
	},
	role: {
		type: Number,
		enum: Object.values(ROLES),
		default: ROLES.USER
	},
	preferredWorkingHours: {
		type: Number,
		default: 8,
	}
});

//custom method to generate authToken
UserSchema.methods.generateAuthToken = function generateAuthToken() {
	const token = jwt.sign({_id: this._id, role: this.role}, config.jwtSecret, { expiresIn: config.jwtExpires });
	return token;
}

UserSchema.methods.encryptPassword = (password) => {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password, salt);
		return hash;
};

UserSchema.methods.isPasswordValid = function isPasswordValid(password) {
	return bcrypt.compareSync(password, this.password);
}

//set password before save.
UserSchema.pre("save", function (next) {
	if(this.password && this.isModified('password')) {
		this.password = this.encryptPassword(this.password);
		next();
	} else {
		next();
	}
});

const User = mongoose.model('User', UserSchema);

//function to validate user
const validateUser = (user) => {
	const schema = {
		firstName: Joi.string().min(3).max(50).required(),
		lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
		password: Joi.string().min(3).max(50).required(),
		role: Joi.number().integer().optional().min(0).max(2).default(ROLES.USER),
		preferredWorkingHours: Joi.number().optional().min(1).max(24).default(8)
	};

	return Joi.validate(user, schema);
}

const validateUpdateUser = (user) => {
	const schema = {
		firstName: Joi.string().min(3).max(50).optional(),
		lastName: Joi.string().min(3).max(50).optional(),
    email: Joi.string().min(5).max(50).optional().email(),
		password: Joi.string().min(3).max(50).optional(),
		role: Joi.number().integer().optional().min(0).max(2).default(ROLES.USER),
		preferredWorkingHours: Joi.number().optional().min(1).max(24).default(8)
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
exports.validateUpdate = validateUpdateUser;