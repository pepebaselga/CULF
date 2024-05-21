const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const itemRouter = require('./starter/routes/itemRoutes');
const userRouter = require('./starter/routes/userRoutes');
const globalErrorHandler = require('./starter/controllers/errorControllers');
const AppError = require('./starter/utils/appError');
const morgan = require('morgan');
const app = express();

//1)GLOBAL MIDDLEWARES
//development loging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limiting Attempts from same API
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
//Set security HTTP headers
app.use(helmet());
//body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middlewear: function that can modify the incoming request data
//serving static files
app.use(express.static(`${__dirname}/starter/dev-data/images`)); //allows handeling html files for url
//test
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});
//2) ROUTES
app.use('/api/v1/items', itemRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, next) => {
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
