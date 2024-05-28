const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Items = require('../../models/itemsModels');
const Users = require('../../models/usersModel');

dotenv.config({ path: `./config.env` });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then((con) => {
    console.log('DB Connection Succesful');
  });

//TODO: READ JASON File
const items = JSON.parse(
  fs.readFileSync(`${__dirname}/items-simple.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users-simple.json`, 'utf-8')
);
//TODO: Import Data
const importItemData = async () => {
  try {
    await Items.create(items);
    console.log('Item data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const importUserData = async () => {
  try {
    await Users.create(users);
    console.log('User data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//TODO: Delete all the data from Collection

const deleteItemData = async () => {
  try {
    await Items.deleteMany();
    console.log('Item data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteUserData = async () => {
  try {
    await Users.deleteMany();
    console.log('User data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Controlling the script
if (process.argv[3] === '--item') {
  if (process.argv[2] === '--import') {
    importItemData();
  } else if (process.argv[2] === '--delete') {
    deleteItemData();
  }
} else if (process.argv[3] === '--user') {
  if (process.argv[2] === '--import') {
    importUserData();
  } else if (process.argv[2] === '--delete') {
    deleteUserData();
  }
}

console.log(process.argv);
