const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const votersRoutes = require('./routes/voters-routes');
const electionsRoutes = require('./routes/elections-routes');
// const adminsRoutes = require('./routes/admins-routes');
const HttpError = require('./models/http-error');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());

app.use('/api/voters', votersRoutes);
app.use('/api/elections', electionsRoutes);
// app.use('/api/admin', adminsRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    throw next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
    .connect(process.env.MONGOURI)
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .catch(err => {
    console.log(err);
    });