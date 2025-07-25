const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getGridFS } = require('../config/db');
const ResearchPaper = require('../models/paper');

const upload = multer();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const paperData = {
      ...req.body,
      paperFile: req.file.originalname,
      status: 'submitted'
    };

    const newPaper = new ResearchPaper(paperData);
    await newPaper.save();

    const gridFSBucket = getGridFS();
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

router.get('/', async (req, res) => {
  try {
    const papers = await ResearchPaper.find().sort({ submittedAt: -1 });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

module.exports = router;

router.get('/download/:id', async (req, res) => {
  try {
    const paper = await ResearchPaper.findById(req.params.id);
    if (!paper) return res.status(404).json({ error: 'Paper not found' });

    const gridFSBucket = getGridFS();
    const downloadStream = gridFSBucket.openDownloadStreamByName(paper.paperFile);
    
    res.set('Content-Type', 'application/pdf');
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Download failed' });
  }
});