import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Mount API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MediExplain AI Server is active.',
    healthEndpoint: '/api/health',
    aiModel: process.env.AI_MODEL || 'gemini-2.5-flash'
  });
});

app.listen(PORT, () => {
  console.log(`MediExplain AI Express Server running on port ${PORT}`);
  console.log(`Configured AI Model: ${process.env.AI_MODEL || 'gemini-2.5-flash'}`);
});

export default app;
