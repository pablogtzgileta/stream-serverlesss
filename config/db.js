const mongoose = require('mongoose');
let isConnected;

module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }

    console.log('=> using new database connection');
    return mongoose.connect(process.env.MongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    ).then(db => {
        isConnected = db.connections[0].readyState;
    });
};
