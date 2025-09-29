// Vercel serverless function for managing announcements
// This uses a simple in-memory approach for demo purposes
// In production, you'd use a database like Vercel KV, MongoDB, or Supabase

let announcementData = {
  title: "🎉 SPECIAL OFFER! 🎉",
  message: "Buy 1 Get the 2nd 40% Off",
  days: "Every Thursday & Friday on All Vapes",
  timestamp: new Date().toISOString()
};

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

  try {
    if (req.method === 'GET') {
      // Return current announcement data
      res.status(200).json(announcementData);
    } else if (req.method === 'POST') {
      // Update announcement data
      const { title, message, days } = req.body;
      
      if (!title || !message || !days) {
        res.status(400).json({ error: 'Missing required fields: title, message, days' });
        return;
      }

      // Update the global data
      announcementData = {
        title: title.trim(),
        message: message.trim(),
        days: days.trim(),
        timestamp: new Date().toISOString()
      };

      res.status(200).json({
        success: true,
        message: 'Announcement updated successfully',
        data: announcementData
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}