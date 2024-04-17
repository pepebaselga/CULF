//make these functions functional
const { query } = require('express');
const Users = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllUsers = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await Users.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        item: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await Users.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

exports.patch = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};
