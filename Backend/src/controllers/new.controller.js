
const News = require('../models/new.model');

// Get all news
exports.getAllNews = async (req, res) => {
  try {
    const { category, limit = 10, page = 1, isPublished = true } = req.query;
    const query = { isPublished: isPublished === 'true' };
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const news = await News.find(query)
      .sort({ publishedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await News.countDocuments(query);
    
    res.status(200).json({
      news,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error while fetching news' });
  }
};

// Get news by ID
exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.status(200).json(news);
  } catch (error) {
    console.error('Error fetching news item:', error);
    res.status(500).json({ message: 'Server error while fetching news item' });
  }
};

// Create news
exports.createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Server error while creating news' });
  }
};

// Update news
exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.status(200).json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Server error while updating news' });
  }
};

// Delete news
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Server error while deleting news' });
  }
};
