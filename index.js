require('dotenv').config();
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const auth = require('./routes/authRoutes');
const properties = require('./routes/propertyRoutes');
const bookings = require('./routes/bookingRoutes');
const reviews = require('./routes/reviewRoutes');
// Import routes
const users = require('./routes/userRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}))

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/properties', properties);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/users', users);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});