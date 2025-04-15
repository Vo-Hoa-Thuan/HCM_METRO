
const Feedback = require('../models/feedback.model');

exports.getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10, source, status, search, unanswered } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};
    
    if (source && source !== 'all') {
      query.source = source;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { comment: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (unanswered === 'true') {
      query.$or = [
        { response: { $exists: false } },
        { response: '' }
      ];
    }
    
    // Count total documents matching the query
    const totalCount = await Feedback.countDocuments(query);
    
    // Get paginated results
    const feedback = await Feedback.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json({
      feedback,
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getting feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json(feedback);
  } catch (error) {
    console.error('Error getting feedback by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment, source, userId, userEmail, userName } = req.body;
    
    // Validate required fields
    if (!rating || !source) {
      return res.status(400).json({ message: 'Rating and source are required' });
    }
    
    // Create new feedback
    const feedback = new Feedback({
      userId,
      rating,
      comment,
      source,
      date: new Date(),
      status: 'new',
      userEmail,
      userName
    });
    
    const savedFeedback = await feedback.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Feedback submitted successfully',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { response, status } = req.body;
    
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update fields if provided
    if (response !== undefined) feedback.response = response;
    if (status !== undefined) feedback.status = status;
    
    const updatedFeedback = await feedback.save();
    
    res.json({ 
      success: true, 
      message: 'Feedback updated successfully',
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    await Feedback.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Feedback deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res) => {
  try {
    // Get total count
    const totalCount = await Feedback.countDocuments();
    
    // Calculate average rating
    const ratingResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const averageRating = ratingResult.length > 0 ? ratingResult[0].avgRating : 0;
    
    // Get ratings distribution
    const ratingsDistribution = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    
    // Format ratings distribution
    const ratingsDistributionObj = {};
    ratingsDistribution.forEach((item) => {
      ratingsDistributionObj[item._id] = item.count;
    });
    
    // Get source distribution
    const sourceDistribution = await Feedback.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);
    
    // Format source distribution
    const sourceDistributionObj = {};
    sourceDistribution.forEach((item) => {
      sourceDistributionObj[item._id] = item.count;
    });
    
    // Get status distribution
    const statusDistribution = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format status distribution
    const statusDistributionObj = {};
    statusDistribution.forEach((item) => {
      statusDistributionObj[item._id] = item.count;
    });
    
    // Get recent trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentTrend = await Feedback.aggregate([
      { 
        $match: { 
          date: { $gte: sevenDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);
    
    // Format recent trend
    const formattedRecentTrend = recentTrend.map(item => ({
      date: `${item._id.year}-${item._id.month}-${item._id.day}`,
      count: item.count,
      averageRating: item.averageRating
    }));
    
    res.json({
      totalCount,
      averageRating,
      ratingsDistribution: ratingsDistributionObj,
      sourceDistribution: sourceDistributionObj,
      statusDistribution: statusDistributionObj,
      recentTrend: formattedRecentTrend
    });
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
