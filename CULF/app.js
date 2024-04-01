const express = require('express');

const app = express();
const itemRouter = require('./starter/routes/itemRoutes');
const userRouter = require('./starter/routes/userRoutes');

app.use(express.json()); //middlewear: function that can modify the incoming request data
// app.use(express.static(`${__dirname}/starter/dev-data/images`)); //allows handeling html files for url

app.use('/api/v1/items', itemRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

// NOTE: THIS IS JUST EXAMPLE GET AND POST USAGE FOR REF.
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server side', app: 'CULF' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint!');
// });
