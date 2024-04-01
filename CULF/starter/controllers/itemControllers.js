const fs = require('fs');

const items = JSON.parse(
  fs.readFileSync('starter/dev-data/data/items-simple.json')
);

//getting the items
exports.getAllItems = (req, res) => {
  console.log('found');
  res.status(200).json({
    status: 'success',
    data: {
      results: items.length,
      items
    }
  });
};

//get a specific item
exports.getItem = (req, res) => {
  const newID = items[items.length - 1].id + 1;
  if (id > items.length - 1) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id!'
    });
  }
  const item = items.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
};

//Creating a item
exports.createItem = (req, res) => {
  const newID = items[items.length - 1].id + 1;
  const newItem = Object.assign({ id: newID }, req.body);
  items.push(newItem);
  fs.writeFile(
    './dev-data/data/items-simple.json',
    JSON.stringify(items),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          item: newItem
        }
      });
    }
  );
};

exports.delete = (req, res) => {
  const id = req.params.id * 1;
  if (id > items.length - 1) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id!'
    });
  }
  const tour = items.find((el) => el.id === id);
  res.status(204).json({
    status: 'success',
    data: null
  });
};

exports.patch = (req, res) => {
  const id = req.params.id * 1;
  if (id > items.length - 1) {
    res.status(404).json({
      status: 'fail',
      message: 'invalid id!'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      item: 'Updated Data Here'
    }
  });
};
