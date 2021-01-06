const moment = require('moment');
const request = require('supertest');
const {Rental} = require ('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require ('../../models/user');
const mongoose = require ('mongoose');



describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});
    }

    beforeEach( async () => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },

            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => { 
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    

    it('Should return 401 if client is not loggin.', async () =>{
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('Should return 400 if customerId is not provided.', async () => {
        customerId ='';
        //another approach:
        // delete payload.customerId;
        const res = await exec ();

        expect(res.status).toBe(400);
    });

    it('Should return 400 if movieId is not provided.', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('Should return 404 if no rental found for the customer/movie.', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('Should return 400 if rental already is processed.', async () => {
        rental.dateReturn = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('Should return 200 if we have a valid request.', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    });
    
    it('Should set the return date if input is valid', async () => {

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturn;
        expect(diff).toBeLessThan(10 * 1000);
        //expect(rentalInDb.dateReturn).toBeDefined();
    });

    it('Should set the rentalFee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14); 
    });

    it('Should increase the movie stock if input is valid', async () => {

        const res = await exec();
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); // or toBe(11)
    });

    it('Should return the rental if input is valid', async () => {

        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturn', 'rentalFee', 'customer', 'movie'])
        );
    });
});