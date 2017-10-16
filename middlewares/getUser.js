import * as userService from '../services/user';

export default async (req, res, next) => {
  const { token } = req;
  let user;

  try {
    user = await userService.getUserByToken(token);
    if (!user) {
      throw new Error('User does not exists!');
    }
  } catch ({ message }) {
    return next({
      status: 403,
      message,
    });
  }

  req.user = user;
  next();
};
