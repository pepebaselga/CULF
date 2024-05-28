const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Put this at front to make sure all exceptions are caught
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: Shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: `./config.env` });
const app = require('./app.js');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB Connection Succesful');
  })
  .catch((err) => console.log('ERROR'));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION: Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
