const express = require('express');
const mongoose = require('mongoose');
const rateTourRoute = require('./routes/rateTourRoute');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/RateToursCheapTripDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/', rateTourRoute);


app.listen(3005, () => {
  console.log('Rating service running on port 3005');
});



