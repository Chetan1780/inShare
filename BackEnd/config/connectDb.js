const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function connect() {
    // console.log("enter");
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            ssl: true,
            dbName: "blog-application"
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

module.exports = connect;  // Export the connect function in CommonJS
