
const Progress = require('../models/progress.model');
const MetroLine = require('../models/line.model');

// Get all progress reports
exports.getAllProgress = async (req, res) => {
  try {
    const { lineId, status, limit = 10, page = 1 } = req.query;
    const query = {};
    
    // Filter by line
    if (lineId) {
      query.lineId = lineId;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const progress = await Progress.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Progress.countDocuments(query);
    
    res.status(200).json({
      progress,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching progress reports:', error);
    res.status(500).json({ message: 'Server error while fetching progress reports' });
  }
};

// Get progress by ID
exports.getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress report not found' });
    }
    
    // Get line info
    const line = await MetroLine.findOne({ id: progress.lineId });
    
    res.status(200).json({
      ...progress.toObject(),
      lineInfo: line ? { name: line.name, color: line.color } : null
    });
  } catch (error) {
    console.error('Error fetching progress report:', error);
    res.status(500).json({ message: 'Server error while fetching progress report' });
  }
};

// Create progress report
exports.createProgress = async (req, res) => {
  try {
    const progress = new Progress(req.body);
    await progress.save();
    
    res.status(201).json(progress);
  } catch (error) {
    console.error('Error creating progress report:', error);
    res.status(500).json({ message: 'Server error while creating progress report' });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    // Check if updating completion percentage
    const existingProgress = await Progress.findById(req.params.id);
    if (existingProgress && req.body.completionPercentage !== undefined && 
        existingProgress.completionPercentage !== req.body.completionPercentage) {
      
      // Add to updates array
      if (!req.body.updates) {
        req.body.updates = existingProgress.updates || [];
      }
      
      req.body.updates.push({
        date: new Date(),
        description: `Completion percentage updated from ${existingProgress.completionPercentage}% to ${req.body.completionPercentage}%`,
        percentageChange: req.body.completionPercentage - existingProgress.completionPercentage
      });
      
      // If 100% complete, update status to completed
      if (req.body.completionPercentage === 100 && !req.body.actualCompletionDate) {
        req.body.status = 'completed';
        req.body.actualCompletionDate = new Date();
      }
    }
    
    const progress = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress report not found' });
    }
    
    res.status(200).json(progress);
  } catch (error) {
    console.error('Error updating progress report:', error);
    res.status(500).json({ message: 'Server error while updating progress report' });
  }
};

// Delete progress
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findByIdAndDelete(req.params.id);
    
    if (!progress) {
      return res.status(404).json({ message: 'Progress report not found' });
    }
    
    res.status(200).json({ message: 'Progress report deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress report:', error);
    res.status(500).json({ message: 'Server error while deleting progress report' });
  }
};

// Get overall progress stats
exports.getProgressStats = async (req, res) => {
  try {
    // Get all metro lines
    const lines = await MetroLine.find();
    
    // Get all progress reports
    const progressReports = await Progress.find();
    
    // Calculate overall stats
    const overallStats = {
      totalLines: lines.length,
      completedLines: 0,
      totalLength: 0,
      completedLength: 0,
      overallCompletion: 0
    };
    
    // Calculate stats for each line
    const lineStats = await Promise.all(lines.map(async (line) => {
      const lineProgress = progressReports.filter(p => p.lineId === line.id);
      
      // Calculate average completion for this line
      const avgCompletion = lineProgress.length > 0 
        ? lineProgress.reduce((sum, p) => sum + p.completionPercentage, 0) / lineProgress.length
        : 0;
      
      // Calculate completed length
      const completedLength = (avgCompletion / 100) * line.length;
      
      // Add to overall stats
      overallStats.totalLength += line.length;
      overallStats.completedLength += completedLength;
      
      if (avgCompletion === 100) {
        overallStats.completedLines++;
      }
      
      return {
        lineId: line.id,
        lineName: line.name,
        lineColor: line.color,
        completionPercentage: avgCompletion,
        length: line.length,
        completedLength,
        status: line.status
      };
    }));
    
    // Calculate overall completion percentage
    overallStats.overallCompletion = overallStats.totalLength > 0 
      ? (overallStats.completedLength / overallStats.totalLength) * 100
      : 0;
    
    res.status(200).json({
      overallStats,
      lineStats
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({ message: 'Server error while fetching progress stats' });
  }
};
