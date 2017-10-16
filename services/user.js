import User from '../models/user';

export const getUserByToken = async ({ _id, googleId }) => {
  let user;

  try {
    if (_id) {
      user = await User.find({ _id }, { password: 0 });
    } else {
      user = await User.find({ googleId }, { password: 0 });
    }
  } catch (err) {
    throw err;
  }

  return user[0];
};
