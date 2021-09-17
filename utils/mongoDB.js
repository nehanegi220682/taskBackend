`use strict`;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/twitterClone', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
});
mongoose.connection
    .once('open', () => {
        console.log("MongoDb Connected");
    })
    .on('error', (error) => {
        console.error('Error', error);
    });
