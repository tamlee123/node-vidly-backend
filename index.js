require('express-async-errors');
require('winston-mongodb');
const winston = require('winston');
const config = require ('config');
const Joi = require("joi");
Joi.objectId = require('joi-objectid') (Joi);
const mongoose = require('mongoose');
const express = require("express");
require('./startup/routes')(app);
const app = express();

winston.handleExceptions(
  new winston.transports.File({ filename: 'uncaughtExceptions.log'})
);

process.on('unhandledRejection', (ex)=>{
  throw ex;
});

 winston.add (winston.transports.File, {filename: 'logfile.log'});
 winston.add (winston.transports.MongoDB, {
   db: 'mongodb://localhost/vidly2',
   level: 'info'
  });
//  const logger = winston.createLogger({
//   transports: [
//    winston.add (new winston.transports.File({ filename: 'logfile.log' }))
//   ]
// });


if(!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly2', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
