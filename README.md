# VapeCenter Website

A modern vape store website with dynamic announcement management.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Access Your Website
- **Main Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 📁 Project Structure

```
├── index.html              # Main website
├── server.js               # Node.js server
├── admin.html              # Admin panel
├── package.json            # Dependencies
├── announcement-data.json  # Auto-generated data file
└── [other HTML files]     # Product pages
```

## 🔧 Admin Panel Features

- **Instant Updates**: Change announcements without code editing
- **Live Preview**: See changes before applying
- **Persistent Storage**: Data saved to JSON file
- **Mobile Responsive**: Works on all devices

## 🌐 Deployment Options

### Option 1: Heroku
1. Create Heroku app
2. Connect GitHub repository
3. Deploy automatically

### Option 2: Railway
1. Connect GitHub repository
2. Deploy with one click

### Option 3: DigitalOcean App Platform
1. Connect GitHub repository
2. Deploy automatically

### Option 4: Self-Hosted
1. Run on any VPS
2. Use PM2 for process management
3. Set up reverse proxy (nginx)

## 📝 How to Update Announcements

1. Go to `/admin` page
2. Fill out the form
3. Click "Update Announcement"
4. Changes appear instantly on main website

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The server will restart automatically on file changes
```

## 📦 Dependencies

- **Express**: Web server framework
- **CORS**: Cross-origin resource sharing
- **Node.js**: Runtime environment

## 🔒 Security Notes

- Admin panel has no authentication (add if needed)
- Data stored in plain JSON file
- For production, consider adding:
  - Password protection
  - Database storage
  - Input validation
  - Rate limiting

## 📞 Support

For issues or questions, contact the development team.
