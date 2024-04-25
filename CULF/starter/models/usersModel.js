const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const usersSchema = new mongoose.Schema({
  netID: {
    type: String,
    required: [true, 'A user must have a netID'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail]
  },
  name: {
    type: String
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'flagged-user', 'finder']
    // required: [true, 'A user must have an assinged role!']
  },

  password: {
    type: String,
    required: [true, 'A user must have a password'],
    unique: true,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirmation'],
    validate: {
      validator: function (val) {
        //this only points to current doc on NEW document creation
        return this.password === val;
      },
      message: 'Passwords do not match',
      select: false
    }
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  photo: {
    type: String
  },
  accountCreated: {
    type: Date,
    required: [true],
    default: Date.now(),
    select: false //automatically limiting this field so that users can't see it
  },
  itemsFound: {
    type: Number,
    default: 0
  },
  itemsLost: {
    type: Number,
    required: [true, 'All users must include items lost'],
    default: 0
  },
  phoneNumber: {
    type: Number
  },
  passwordChangedAt: {
    type: Date,
    default: null
  }
});

usersSchema.pre('save', async function (next) {
  //Only run this function if password was created or modified
  if (!this.isModified('password')) return next();
  //hash the password with cost of 14
  this.password = await bcrypt.hash(this.password, 14);
  //delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

usersSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  console.log(this.passwordChangedAt);
  next();
});
usersSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

usersSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

usersSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Users = mongoose.model('users', usersSchema);

module.exports = Users;
