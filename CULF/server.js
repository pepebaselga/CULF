const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });
const app = require('./app.js');

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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
