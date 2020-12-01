const Joi = require("joi");
const genreSchema = require('./genre');
const mongoose = require('mongoose');


const Movie = mongoose.model('Movies', new mongoose.Schema({
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

}));

function validateMovie(movie) {
    const Schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    };
    return Joi.validate(movie, Schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;