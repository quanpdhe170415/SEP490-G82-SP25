require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose'); // Import mongoose
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const port = process.env.PORT || 9999;
const db = require('./models'); 
const routes = require("./route/index.js"); // Import your routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', routes);
//Connect to MongoDB
db.connectDB().then(() => {
  console.log('Database connected successfully');
  console.log('Available models:', Object.keys(db));
  
  // Bây giờ bạn có thể sử dụng các model
  // Ví dụ: db.Account, db.Role, db.Goods, etc.
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});