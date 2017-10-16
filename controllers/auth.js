import jwt from 'jsonwebtoken';
import GoogleAuth from 'google-auth-library';

import config from '../config';
import User from '../models/user';

const auth = new GoogleAuth;
const client = new auth.OAuth2(config.google.client_id, '', '');

const verifyGoogleToken = (token, client_id) => {
  return new Promise((resolve) => {
    client.verifyIdToken(token, client_id, (e, login) => {
      const payload = login.getPayload();
      const userid = payload['sub'];

      const user = {
        email: payload.email,
        name: payload.name,
        password: userid,
        googleId: userid,
      };
      resolve(user);
    });
  });
}

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
      user,
      token,
    });
};

export const googleLogin = async (req, res, next) => {
  const googleToken = req.body.token;
  let credentials,
    token,
    user;

  try {
    credentials = await verifyGoogleToken(googleToken, config.google.client_id);
    user = await User.findOne({ googleId: credentials.googleId });

    if (!user) {
      user = await User.create(credentials);
    }

    token = await jwt.sign({ googleId: credentials.googleId }, config.secret);
  } catch ({ message }) {
    return next({
      status: 400,
      message,
    });
  }

  res
    .status(200)
    .json({
      token,
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
}
