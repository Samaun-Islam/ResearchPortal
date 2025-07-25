const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let gridFSBucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    gridFSBucket = new GridFSBucket(conn.connection.db, {
      bucketName: 'papers'
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return gridFSBucket;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const getGridFS = () => gridFSBucket;

module.exports = { connectDB, getGridFS };