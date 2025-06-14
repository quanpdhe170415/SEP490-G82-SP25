const express = require('express');
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser'); // Import body-parser
const connectDB = require('./configs/db');
const app = express();
require('dotenv').config();
const router = require('./route/index');
const port = process.env.PORT || 9999;
const { Server } = require('socket.io');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URL, {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
//   dbName: process.env.DB_NAME
// }).then( () => {
//   console.log('Connected to MongoDB');

//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }).catch(err => {
//   console.error('Database connection error:', err);
// });
app.use('/api',router);
 connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });