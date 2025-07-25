const Paper = require('../models/Paper');
const { getFileStream, getFileByName } = require('../services/fileService');

// Upload paper with PDF
exports.uploadPaper = async (req, res) => {
  try {
    const { title, authors, abstract, keywords } = req.body;
    
    const paper = new Paper({
      title,
      authors,
      abstract,
      keywords,
      pdfFilename: req.file.filename,
      pdfId: req.file.id,
      status: 'review',
      views: 0,
      downloads: 0,
      citations: 0
    });
    
    await paper.save();
    
    res.status(201).json(paper);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get paper PDF
exports.getPaperPDF = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    const file = await getFileByName(paper.pdfFilename);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Set content type
    res.set('Content-Type', file.contentType);
    
    // Stream the file
    const readStream = getFileStream(file._id);
    readStream.pipe(res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Other controller methods (getPapers, updatePaper, etc.)