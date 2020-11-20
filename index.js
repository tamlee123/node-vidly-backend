const mongoose = require('mongoose');

const express = require("express");
const genres = require("./routes/genres");
const app = express();

mongoose.connect('mongodb://localhost/vidly2', {useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(() => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.use("/api/genres", genres);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
