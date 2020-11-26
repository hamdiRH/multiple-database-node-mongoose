const mongoose = require('mongoose');

const MyClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subdomain: { type: String, required: true, unique: true, default: ' ', trim: true, index: true, sparse: true },
    dbUrl: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      sparse: true,
      default: function () {
        return this.subdomain;
      },
    },
  },
  { timestamps: true }
);

/**
 * Check if email is taken
 */
MyClientSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};
/**
 * Check if DbUrl is taken
 */
MyClientSchema.statics.isdbUrlTaken = async function (dbUrl) {
  const user = await this.findOne({ dbUrl });
  return !!user;
};
/**
 * Check if Subdomain is taken
 */
MyClientSchema.statics.isSubDomainTaken = async function (subdomain) {
  const user = await this.findOne({ subdomain });
  return !!user;
};
/**
 * Check if Matricule fiscal is taken
 */
MyClientSchema.statics.isMatFisTaken = async function (mat_fis) {
  const user = await this.findOne({ mat_fis });
  return !!user;
};

MyClientSchema.statics.verifiedMyClient = async function (email) {
  const user = await this.findOne({ email });
  if (!user.verified) {
    user.verified = true;
    await user.save();
  }
};

module.exports = MyClientSchema;
