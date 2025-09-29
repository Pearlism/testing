const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

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

// Debug route to list files
app.get('/debug/files', (req, res) => {
  try {
    const files = fs.readdirSync(__dirname).filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
    );
    res.json({
      dirname: __dirname,
      cwd: process.cwd(),
      imageFiles: files,
      allFiles: fs.readdirSync(__dirname)
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Images will be served by Vercel static files

// Helper function to get content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  return types[ext] || 'application/octet-stream';
}

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
