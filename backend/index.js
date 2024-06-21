const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://doh-app-446575e57f3f.herokuapp.com' : 'http://localhost:5173',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

const helmet = require('helmet');
app.use(helmet());

const compression = require('compression');
app.use(compression());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/recipes', require('./routes/recipe')); // Recipe routes

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
