const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema(
  {

    username: { type: String },
    email: { type: String },
    password: { type: String },

    
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * Check if email is taken
 */
UserSchema.statics.isTaken = async function (email, username, cin) {
  const user = await this.findOne({ $or: [{ email }, { username }, { cin }] });
  if (!user) return !!user;
  else if (user.email == email) return 'Email déja existe';
  else if (user.username == username) return 'username déja existe';
  else if (user.cin == cin) return 'cin déja existe';
  else return !!user;
};

UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

UserSchema.methods.getUserById = function (id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  const query = { email };
  User.findOne(query, callback);
};

module.exports.comparePassword = function (candidatePass, hash, callback) {
  bcrypt.compare(candidatePass, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports = UserSchema;
