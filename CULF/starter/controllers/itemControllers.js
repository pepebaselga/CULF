const Items = require('../models/itemsModels');
const APIFeatures = require('../utils/apiFeatures');

//special control for most frequent calls (newest item found)
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '1';
  req.query.sort = 'claimed,-dateFound';
  req.query.fields =
    'item,type,dateFound,claimed,location,room,uniqueDescriptors,color,room';
  next();
};

//getting the items
exports.getAllItems = async (req, res) => {
  try {
    //TODO: EXECUTE QUERY
    const features = new APIFeatures(Items.find(), req.query)
      .fitler()
      .sort()
      .limitFields()
      .paginate();

    const items = await features.query;
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

exports.getItemStats = async (req, res) => {
  try {
    const stats = await Items.aggregate([
      {
        $match: { claimed: false }
      },
      {
        $group: {
          _id: { $toUpper: '$location' },
          numItems: { $sum: 1 },
          avgEstimatedPrice: { $avg: '$estimatedPrice' },
          minEstimatedPrice: { $min: '$estimatedPrice' },
          maxEstimatedPrice: { $max: '$estimatedPrice' }
        }
      },
      {
        $sort: { avgPrice: 1 } //1 for ascending 0 for dscending
      }
      // {
      //   //can repeat stages
      //   $match: { _id: { $ne: 'WEST CAMPUS' } }
      // }
    ]);
    console.log(stats);
    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Items.aggregate([]);
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
