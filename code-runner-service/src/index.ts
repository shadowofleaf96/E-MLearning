import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { executeRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Simple security check using a static token
const RUNNER_SECRET = process.env.RUNNER_SECRET || 'dev-secret-123';
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  
  const token = req.headers['x-runner-secret'];
  if (token !== RUNNER_SECRET) {
    return res.status(403).json({ error: 'Unauthorized caller' });
  }
  next();
});

app.use('/execute', executeRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'code-runner' });
});

app.listen(PORT, () => {
  console.log(`🚀 Code Runner Service listening on port ${PORT}`);
});
