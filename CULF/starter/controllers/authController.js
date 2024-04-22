const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = (id) => {
  const token = jwt.sign(
    {
      id: id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
  return token;
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    netID: req.body.netID,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });
  const token = signToken(newUser._id);

  res.status(200).json({
    status: 'Success',
    token,
    date: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2) check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password'); //need + since password select is made false
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  //3) if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token: token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get the users JWS and ensure it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists'),
      401
    );
  }
  //4) cehck if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  //GRANT ACESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
