const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Serve images with proper headers
app.get('*.{png,jpg,jpeg,gif,svg,ico,webp}', (req, res) => {
  const imagePath = path.join(__dirname, req.path);
  const ext = path.extname(req.path).toLowerCase();
  
  const contentTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
  };
  
  res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.log(`Image not found: ${req.path}`);
      res.status(404).send('Image not found');
    }
  });
});

// Default announcement data
const defaultData = {
  title: "🎉 SPECIAL OFFER! 🎉",
  message: "Buy 1 Get the 2nd 40% Off",
  days: "Every Thursday & Friday on All Vapes",
  timestamp: new Date().toISOString()
};

// In-memory storage for Vercel (since file system is read-only)
let announcementData = { ...defaultData };
let reviewsData = [];

// Read announcement data
function readAnnouncementData() {
  return announcementData;
}

// Write announcement data (in-memory only for Vercel)
function writeAnnouncementData(data) {
  try {
    announcementData = { ...data };
    console.log('Announcement data updated in memory:', announcementData);
    return true;
  } catch (error) {
    console.error('Error updating announcement data:', error);
    return false;
  }
}

// API Routes
app.get('/api/announcement', (req, res) => {
  try {
    const data = readAnnouncementData();
    console.log('GET /api/announcement - returning:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in GET /api/announcement:', error);
    res.status(500).json({ error: 'Failed to read announcement data' });
  }
});

app.post('/api/announcement', (req, res) => {
  try {
    console.log('POST /api/announcement - received:', req.body);
    const { title, message, days } = req.body;
    
    if (!title || !message || !days) {
      console.log('Missing required fields:', { title, message, days });
      return res.status(400).json({ 
        error: 'Missing required fields: title, message, days' 
      });
    }

    const newAnnouncementData = {
      title: title.trim(),
      message: message.trim(),
      days: days.trim(),
      timestamp: new Date().toISOString()
    };

    console.log('Updating announcement data:', newAnnouncementData);

    if (writeAnnouncementData(newAnnouncementData)) {
      console.log('Announcement updated successfully');
      res.json({
        success: true,
        message: 'Announcement updated successfully',
        data: newAnnouncementData
      });
    } else {
      console.error('Failed to write announcement data');
      res.status(500).json({ 
        error: 'Failed to save announcement data' 
      });
    }
  } catch (error) {
    console.error('Error in POST /api/announcement:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + error.message 
    });
  }
});

// Reviews API Routes
app.get('/api/reviews', (req, res) => {
  try {
    console.log('GET /api/reviews - returning reviews:', reviewsData.length);
    res.json(reviewsData);
  } catch (error) {
    console.error('Error in GET /api/reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews', (req, res) => {
  try {
    console.log('POST /api/reviews - received:', req.body);
    const { reviewerName, reviewTitle, reviewDescription, rating } = req.body;
    
    if (!reviewerName || !reviewTitle || !reviewDescription) {
      console.log('Missing required fields:', { reviewerName, reviewTitle, reviewDescription });
      return res.status(400).json({ 
        error: 'Missing required fields: reviewerName, reviewTitle, reviewDescription' 
      });
    }

    const newReview = {
      id: Date.now().toString(),
      reviewerName: reviewerName.trim(),
      title: reviewTitle.trim(),
      description: reviewDescription.trim(),
      rating: parseInt(rating) || 5,
      image: null, // Disabled for Vercel deployment
      date: new Date().toISOString()
    };

    reviewsData.unshift(newReview); // Add to beginning of array
    console.log('Review added successfully:', newReview);

    res.json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error in POST /api/reviews:', error);
    res.status(500).json({ 
      error: 'Internal server error: ' + error.message 
    });
  }
});

// Delete individual review
app.delete('/api/reviews/:reviewId', (req, res) => {
  try {
    const { reviewId } = req.params;
    console.log('DELETE /api/reviews/:reviewId - deleting review:', reviewId);
    
    const initialLength = reviewsData.length;
    reviewsData = reviewsData.filter(review => review.id !== reviewId);
    
    if (reviewsData.length < initialLength) {
      console.log('Review deleted successfully');
      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } else {
      console.log('Review not found');
      res.status(404).json({
        error: 'Review not found'
      });
    }
  } catch (error) {
    console.error('Error in DELETE /api/reviews/:reviewId:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// Delete all reviews
app.delete('/api/reviews', (req, res) => {
  try {
    console.log('DELETE /api/reviews - clearing all reviews');
    
    const deletedCount = reviewsData.length;
    reviewsData = [];
    
    console.log(`Cleared ${deletedCount} reviews`);
    res.json({
      success: true,
      message: `All reviews cleared (${deletedCount} reviews deleted)`,
      deletedCount
    });
  } catch (error) {
    console.error('Error in DELETE /api/reviews:', error);
    res.status(500).json({
      error: 'Internal server error: ' + error.message
    });
  }
});

// Serve main HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/thcaproducts', (req, res) => {
  res.sendFile(path.join(__dirname, 'thcaproducts.html'));
});

app.get('/vapedevices', (req, res) => {
  res.sendFile(path.join(__dirname, 'vapedevices.html'));
});

app.get('/ejuice', (req, res) => {
  res.sendFile(path.join(__dirname, 'ejuice.html'));
});

app.get('/vaporizers', (req, res) => {
  res.sendFile(path.join(__dirname, 'vaporizers.html'));
});

app.get('/reviews', (req, res) => {
  res.sendFile(path.join(__dirname, 'reviews.html'));
});

app.get('/topshelf', (req, res) => {
  res.sendFile(path.join(__dirname, 'topshelf.html'));
});

// Serve individual brand pages
app.get('/lostmarry', (req, res) => {
  res.sendFile(path.join(__dirname, 'lostmarry.html'));
});

app.get('/north', (req, res) => {
  res.sendFile(path.join(__dirname, 'north.html'));
});

app.get('/fogger', (req, res) => {
  res.sendFile(path.join(__dirname, 'fogger.html'));
});

app.get('/geekbar', (req, res) => {
  res.sendFile(path.join(__dirname, 'geekbar.html'));
});

app.get('/breeze', (req, res) => {
  res.sendFile(path.join(__dirname, 'breeze.html'));
});

app.get('/ijoy', (req, res) => {
  res.sendFile(path.join(__dirname, 'ijoy.html'));
});

app.get('/razz', (req, res) => {
  res.sendFile(path.join(__dirname, 'razz.html'));
});

app.get('/offstamp', (req, res) => {
  res.sendFile(path.join(__dirname, 'offstamp.html'));
});

// Handle 404 for unmatched routes
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Export for Vercel
module.exports = app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 VapeCenter server running on port ${PORT}`);
    console.log(`📱 Main website: http://localhost:${PORT}`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`📊 API endpoint: http://localhost:${PORT}/api/announcement`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server gracefully...');
    process.exit(0);
  });
}
