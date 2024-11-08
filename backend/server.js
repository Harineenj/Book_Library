const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the database connection function
const authRoutes = require('./routes/authRoutes'); // Import your auth routes
const bookRoutes = require('./routes/bookRoutes'); // Import book routes
const contactRoute = require('./routes/contact');

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
connectDB().then(() => {
  console.log("Database connected successfully");

  // Use the auth routes under the /api/auth path
  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes); // Add book routes
  app.use('/api/contact', contactRoute);
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("Failed to connect to MongoDB:", error);
});
