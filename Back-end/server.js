require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose'); // Import mongoose
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const port = process.env.PORT || 9999;
const routes = require('./route');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', routes);

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  dbName: process.env.DB_NAME
}).then(() => {
  console.log('Connected to MongoDB');
  console.log(`MongoDB URL: ${process.env.MONGODB_URL}${process.env.DB_NAME}`);
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection error:', err);
});