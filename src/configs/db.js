const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            useNewUrlParser: true,
        });
        console.log(colors.green('Connect MongoDB successfully'));
    } catch (error) {
        console.log(colors.red('Connect MongoDB failed'));
        process.exit(0);
    }
};
process.on('SIGINT', async () => {
    console.log('Killed server');
    await mongoose.connection.close();
    process.exit(0);
});
module.exports = connectDB;
