const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const { promisify } = require('util');
const { reset } = require('nodemon');

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
    passwordConfirm: req.body.passwordConfirm
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

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles: ['admin','finder']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action!', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user baded on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        'There is no user with this email address! Please enter email associated with your account.',
        404
      )
    );
  }
  //2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetURL);
  const message = `Forgot your password? Submit a PATCH request with your new passwoed and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ingore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset (token valid for 10 mins)',
      message: message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword = (req, res, next) => {};
