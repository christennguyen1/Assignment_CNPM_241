require('dotenv').config();
const mongoose = require('mongoose');
const atlas =
    'mongodb+srv://' +
    process.env.DATABASE_NAME +
    ':' +
    process.env.DATABASE_PASSWORD +
    '@clustertest.no5xu.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTest';

const connect = async () => {
    try {
        await mongoose.connect(atlas);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};


module.exports = { connect };
