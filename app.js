const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const userRoute = require('./routes/userRoutes')
const candidaterRoute = require('./routes/candidateRoutes')

mongoose.connect(process.env.MONGO_URL)

app.use('/user',userRoute)
app.use('/candidate',candidaterRoute)

app.listen(4000,() => {
    console.log(`Server is running on ${PORT}`);
})