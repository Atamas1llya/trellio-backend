import jwt from 'jsonwebtoken';

import config from '../config';

export default async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  let tokenObject;

  try {
    tokenObject = await jwt.verify(token, config.secret);
  } catch (err) {
    return next({
      status: 403,
      message: 'Invalid token',
    });
  }


  req.token = tokenObject;
  next();
};
