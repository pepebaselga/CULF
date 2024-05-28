//make these functions functional
const { query } = require('express');
const Users = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Users.find(), req.query)
    .fitler()
    .sort()
    .limitFields()
    .paginate();

  //Execute Query
  const user = await features.query;
  //Send Response
  res.status(200).json({
    status: 'success',
    data: {
      results: user.length,
      user
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) Create Error if user Posts Passwords Data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update, please use /updatePassword',
        400
      )
    );
  }
  //2) Update User
  //filtered out unwanted field names so users can change things like their roles.
  const filteredBody = filterObj(req.body, 'name', 'email', 'phoneNumber');
  const updatedUser = await Users.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Users.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success'
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await Users.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await Users.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      item: newUser
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await Users.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.patch = catchAsync(async (req, res, next) => {
  const newUser = await Users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      netID: newUser
    }
  });
});
