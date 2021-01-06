const Joi = require ('joi');
const moment = require ('moment');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();



router.post('/',auth, async(req, res) => {  
   // if(!req.body.customerId) return res.status(400).send("customerId not provided");
   // if(!req.body.movieId) return res.status(400).send("movieId not provided");
   const { error } = validateReturn(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const rental = await Rental.findOne({
      'customer._id': req.body.customerId,
      'movie._id': req.body.movieId
      

   });

   if(!rental) return res.status(404).send('Rental not found');

   if(rental.dateReturn) return res.status(400).send('Rental already processed.');

   rental.dateReturn = new Date();
   const rentalDays = moment().diff(rental.dateOut, 'days');
   rental.rentalFee = rentalDays *  rental.movie.dailyRentalRate;
   
   await rental.save();

   await Movie.update({_id: rental.movie._id}, {
      $inc: {numberInStock: 1}
   });
   return res.status(200).send(rental);

});

function validateReturn(req) {
   const schema = {
     customerId: Joi.objectId().required(),
     movieId: Joi.objectId().required()
   };
 
   return Joi.validate(req, schema);
 }

module.exports = router;