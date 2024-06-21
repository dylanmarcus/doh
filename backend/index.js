const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://doh-app-446575e57f3f.herokuapp.com' : 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security and compression middleware
app.use(helmet());
app.use(compression());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

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