const Items = require('../models/itemsModels');

//getting the items
exports.getAllItems = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedField = ['page', 'sort', 'limit', 'fields'];
    excludedField.forEach((el) => delete queryObj[el]);

    console.log(req.query, queryObj);
    const query = Items.find(queryObj);

    //{ itemsFound: '0', itemsLost:{ $gte: '0'} }
    //{ itemsFound: '0', itemsLost: { gte: '0' } }
    const items = await query;
    res.status(200).json({
      status: 'success',
      data: {
        results: items.length,
        items
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

//get a specific item
exports.getItem = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        item
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

//Creating a item
exports.createItem = async (req, res) => {
  try {
    const newItem = await Items.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        item: newItem
      }
    });
  } catch (err) {
    req.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};

exports.delete = async (req, res) => {
  try {
    await Items.findByIdAndDelete(req.params.id);
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
    const newItem = await Items.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        newItem
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid Data Sent!'
    });
  }
};
