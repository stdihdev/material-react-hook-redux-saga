const { User, validate } = require("../models/user");

async function signIn(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    console.log(user)
    if (user.isPasswordValid(req.body.password)) {
      const token = user.generateAuthToken();
      res.json({
        info: {
          _id: user._id, // eslint-disable-line
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredWorkingHours: user.preferredWorkingHours,
        },
        token
      });
    } else {
      res.status(401).send("Invalid credential");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
    next(error);
  }
};

async function signUp(req, res, next) {
  try {
    //validate the request body
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //find an existing user
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("User is already registered.");

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    const newUser = await user.save();
    res.send({newUser});

  } catch (error) {
    res.status(500).send("Internal server error");
    next(error)    
  }
}

module.exports = {
  signIn,
  signUp
};