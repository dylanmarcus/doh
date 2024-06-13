const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.json());

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key for signing session ID
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }) // Store sessions in MongoDB
}));

// Initialize Passport and session middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/recipes', require('./routes/recipe')); // Recipe routes

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
