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
      message: err
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
      message: err
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
    res.status(400).json({
      status: 'fail',
      message: err
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
      message: err
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
          avgEstimatedPrice: { $avg: '$estimatePrice' },
          minEstimatedPrice: { $min: '$estimatePrice' },
          maxEstimatedPrice: { $max: '$estimatePrice' }
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

exports.monthsFound = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Items.aggregate([
      {
        $unwind: '$dateFound'
      },
      {
        $match: {
          dateFound: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$dateFound' },
          numberOfItems: { $sum: 1 },
          items: { $push: '$item' }
        }
      },
      {
        $addFields: { month: `$_id` }
      },
      {
        $project: {
          _id: 0 //0 hides the field, 1 shows it
        }
      },
      {
        $sort: { numberOfItems: 1 }
      }
    ]);
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
