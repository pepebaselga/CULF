//make these functions functional
const { query } = require('express');
const Users = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

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
