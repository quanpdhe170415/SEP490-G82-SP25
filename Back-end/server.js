require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http'); // 👈 Thêm dòng này
const { Server } = require('socket.io');
const routes = require('./route/index');
const app = express();
const port = process.env.PORT || 9999;

// Tạo HTTP server từ Express app
const server = http.createServer(app);

// Khởi tạo socket.io với HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // 👈 cho phép mọi domain (có thể chỉnh sau)
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.json());
app.use('/api', routes); // Tất cả route sẽ bắt đầu từ /api

// WebSocket: Lắng nghe kết nối client
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  // Gửi thông báo khi client kết nối
  socket.emit('notification', { message: 'Kết nối thành công tới server!' });

  // Nhận sự kiện từ client
  socket.on('clientMessage', (data) => {
    console.log('📨 Message from client:', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Kết nối MongoDB và start server
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME
}).then(() => {
  console.log('✅ Connected to MongoDB');

  // Bắt đầu HTTP server (có socket.io)
  server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('❌ Database connection error:', err);
});
