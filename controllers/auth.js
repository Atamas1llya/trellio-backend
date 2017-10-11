import jwt from 'jsonwebtoken';

import config from '../config';
import User from '../models/user';

export const signup = async (req, res, next) => {
  const credentials = req.body;
  let user, token;

  try {
    user = await User.create(credentials);
    token = await jwt.sign({ _id: user._id }, config.secret);
  } catch (err) {
    const message = Object
      .values(err.errors)
      .join(', '); // get string error from errors objects

    return next({
      status: 400,
      message,
    });
  };

  res
    .status(201)
    .json({
      message: 'You have successfully registered!',
      token,
      user,
    });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user, token;

  try {
    user = await User.findOne({ email });
    await user.comparePassword(password);

    token = await jwt.sign({ _id: user._id }, config.secret);
  } catch (err) {
    return next({
      status: 400,
      message: 'Invalid email or password!',
    });
  }

  res
    .status(200)
    .json({
      success: true,
      user,
      token,
    });
};
