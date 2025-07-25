const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'papers'
    };
  }
});

const upload = multer({ storage });

// Initialize GridFS stream
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('papers');
});

// Get file by filename
const getFileByName = async (filename) => {
  return await gfs.files.findOne({ filename });
};

// Get file stream by id
const getFileStream = (id) => {
  return gfs.createReadStream({ _id: id });
};

// Delete file by id
const deleteFile = (id) => {
  return gfs.delete({ _id: id });
};

module.exports = {
  upload,
  getFileByName,
  getFileStream,
  deleteFile
};