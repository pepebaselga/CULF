const Items = require('../models/itemsModels');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//special control for most frequent calls (newest item found)
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '1';
  req.query.sort = 'claimed,-dateFound';
  req.query.fields =
    'item,type,dateFound,claimed,location,room,uniqueDescriptors,color,room';
  next();
};

//getting the items
exports.getAllItems = catchAsync(async (req, res, next) => {
  //TODO: EXECUTE QUERY
  const features = new APIFeatures(Items.find(), req.query)
    .fitler()
    .sort()
    .limitFields()
    .paginate();
  //

  const items = await features.query;

  res.status(200).json({
    status: 'success',
    data: {
      results: items.length,
      items
    }
  });
});

//get a specific item
exports.getItem = catchAsync(async (req, res, next) => {
  const item = await Items.findById(req.params.id);
  if (!item) {
    return next(new AppError('No items found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
});

//Creating a item
exports.createItem = catchAsync(async (req, res, next) => {
  const newItem = await Items.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      item: newItem
    }
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  const item = await Items.findByIdAndDelete(req.params.id);
  if (!item) {
    return next(new AppError('No items found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.patch = catchAsync(async (req, res, next) => {
  const newItem = await Items.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!newItem) {
    return next(new AppError('No items found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      newItem
    }
  });
});

exports.getItemStats = catchAsync(async (req, res, next) => {
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
  ]);
  console.log(stats);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.monthsFound = catchAsync(async (req, res, next) => {
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
});
