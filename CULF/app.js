const express = require('express');
const itemRouter = require('./starter/routes/itemRoutes');
const userRouter = require('./starter/routes/userRoutes');
const globalErrorHandler = require('./starter/controllers/errorControllers');
const AppError = require('./starter/utils/appError');
const morgan = require('morgan');
const app = express();

//1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //middlewear: function that can modify the incoming request data
app.use(express.static(`${__dirname}/starter/dev-data/images`)); //allows handeling html files for url
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
//2) ROUTES
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404); //by passing in error knows it needs to go to error handeling middlewear
}); //all catches all verb and star all urls

app.use(globalErrorHandler);
//Global Error Handeling Middlewear

module.exports = app;

// NOTE: THIS IS JUST EXAMPLE GET AND POST USAGE FOR REF.
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server side', app: 'CULF' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint!');
// });
