const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Data file path
const DATA_FILE = path.join(__dirname, 'announcement-data.json');

// Default announcement data
const defaultData = {
  title: "🎉 SPECIAL OFFER! 🎉",
  message: "Buy 1 Get the 2nd 40% Off",
  days: "Every Thursday & Friday on All Vapes",
  timestamp: new Date().toISOString()
};

// Read announcement data from file
function readAnnouncementData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading announcement data:', error);
  }
  return defaultData;
}

// Write announcement data to file
function writeAnnouncementData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing announcement data:', error);
    return false;
  }
}

// API Routes
app.get('/api/announcement', (req, res) => {
  const data = readAnnouncementData();
  res.json(data);
});

app.post('/api/announcement', (req, res) => {
  const { title, message, days } = req.body;
  
  if (!title || !message || !days) {
    return res.status(400).json({ 
      error: 'Missing required fields: title, message, days' 
    });
  }

  const announcementData = {
    title: title.trim(),
    message: message.trim(),
    days: days.trim(),
    timestamp: new Date().toISOString()
  };

  if (writeAnnouncementData(announcementData)) {
    res.json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcementData
    });
  } else {
    res.status(500).json({ 
      error: 'Failed to save announcement data' 
    });
  }
});

// Serve the main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
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
