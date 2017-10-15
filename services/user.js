import User from '../models/user';

export const getUserByToken = async (token) => {
  const { _id } = token;
  let user;

  try {
    user = await User.find({ _id }, { password: 0 });
  } catch (err) {
    throw err;
  }

  return user[0];
};
