const Joi = require("joi");

const mongoose = require('mongoose');


const Rental = mongoose.model('Rental', new mongoose.Schema ({

    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required : true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required : true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema ({
            title: {
                type: String,
                required : true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            genre: {
                type: genreSchema,
                required: true
            },
            numberInStock: {
                type: Number,
                required: true,
                min: 0,
                max: 225
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 225
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental) {
    const schema = {
      customerId: Joi.string().required(),
      movieId: Joi.string().required(),
    };
  
    return Joi.validate(rental, schema);
  }

  exports.Rental = Rental;
  exports.validate = validateRental;
