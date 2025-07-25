const mongoose = require('mongoose');

const ResearchPaperSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  universityName: { type: String, required: true },
  paperTitle: { type: String, required: true },
  abstract: { type: String, required: true },
  keywords: { type: String, required: true },
  paperFile: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['submitted', 'under_review', 'published', 'rejected'], 
    default: 'submitted' 
  },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 }
});

module.exports = mongoose.model('ResearchPaper', ResearchPaperSchema);