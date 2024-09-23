const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security and compression middleware
app.use(helmet());
app.use(compression());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/recipes', require('./routes/recipe')); // Recipe routes

// Serve static files from the frontend's dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle SPA: redirect all non-API requests to the SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));