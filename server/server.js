import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bharat_yatra';

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static monuments images from client/public/monuments
app.use('/monuments', express.static(path.join(__dirname, '../client/public/monuments')));

// API Base Route
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bharat Yatra API - Centralized Indian Tourism & AI Trip Planning Platform',
    version: '1.0.0',
    docs: '/api/health'
  });
});

mongoose.set('bufferCommands', false);

// Connect to MongoDB with graceful fast fallback
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 2500
})
  .then(() => {
    console.log('✅ Connected to MongoDB Database successfully.');
  })
  .catch((err) => {
    console.log('ℹ️ Note: Running in Zero-Config Standalone Mode with In-Memory State Store.');
  });

app.listen(PORT, () => {
  console.log(`🚀 Bharat Yatra Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check endpoint: http://localhost:${PORT}/api/health`);
});
