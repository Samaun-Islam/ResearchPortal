// routes/submitRoute.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getGridFS } = require('../config/db');
const ResearchPaper = require('../models/paper');

const upload = multer();

// Submit research paper
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const gridFSBucket = getGridFS();
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a new Paper document
    const paperData = {
      ...req.body,
      paperFile: req.file.originalname, // Store original filename
      status: 'submitted'
    };

    const newPaper = new ResearchPaper(paperData);
    await newPaper.save();

    // Upload file to GridFS
    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
      metadata: {
        paperId: newPaper._id,
        contentType: req.file.mimetype
      }
    });

    uploadStream.end(req.file.buffer);

    res.status(201).json({
      message: 'Paper submitted successfully',
      paperId: newPaper._id
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to submit paper' });
  }
});

// Get all papers
router.get('/', async (req, res) => {
  try {
    const papers = await ResearchPaper.find().sort({ submittedAt: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

module.exports = router;