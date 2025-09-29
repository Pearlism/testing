// Vercel serverless function for managing announcements
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // In-memory storage (for demo - in production you'd use a database)
  // For now, we'll use a simple file or environment variables
  let announcementData = {
    title: "🎉 SPECIAL OFFER! 🎉",
    message: "Buy 1 Get the 2nd 40% Off",
    days: "Every Thursday & Friday on All Vapes",
    timestamp: new Date().toISOString()
  };

  // Try to get existing data from environment variables or use defaults
  try {
    if (process.env.ANNOUNCEMENT_TITLE) {
      announcementData = {
        title: process.env.ANNOUNCEMENT_TITLE,
        message: process.env.ANNOUNCEMENT_MESSAGE || "Buy 1 Get the 2nd 40% Off",
        days: process.env.ANNOUNCEMENT_DAYS || "Every Thursday & Friday on All Vapes",
        timestamp: process.env.ANNOUNCEMENT_TIMESTAMP || new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error loading announcement data:', error);
  }

  if (req.method === 'GET') {
    // Return current announcement data
    res.status(200).json(announcementData);
  } else if (req.method === 'POST') {
    // Update announcement data
    const { title, message, days } = req.body;
    
    if (!title || !message || !days) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Update the data
    announcementData = {
      title,
      message,
      days,
      timestamp: new Date().toISOString()
    };

    // In a real application, you would save this to a database
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: announcementData
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
