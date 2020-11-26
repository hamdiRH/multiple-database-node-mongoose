import _ from 'lodash';

const getUserById = async (User, id) => {
  const user = await User.findById(id);
  return user;
};
const getUserByEmail = async (User, email) => {
  const user = await User.findOne({ email });
  return user;
};

export default {
  getUserById,
  getUserByEmail,
};
