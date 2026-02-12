const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const open = require('open').default;
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// ✅ Serve everything in frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

// ✅ Only serve index.html for real frontend routes, not css/js files
// Serve index.html for frontend routes, but exclude static assets
// Serve static files (css, js, images) correctly
app.use(express.static(path.join(__dirname, '../frontend/index.html')));

// Only serve index.html for routes that are not files or APIs
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});



// ✅ Global error handler (keeps server from crashing on API errors)
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ MongoDB connection
console.log("🔍 MongoDB URI:", process.env.MONGODB_URI); // Debug log

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    const url = `http://localhost:${PORT}`;

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at: ${url}`);
      open(url); // auto-open browser
    });

    // ✅ Graceful shutdown (Ctrl+C)
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      await mongoose.connection.close();
      server.close(() => {
        console.log('✅ Server and MongoDB closed');
        process.exit(0);
      });
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
