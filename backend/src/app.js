import express from 'express';
import cors from 'cors';
import alertRouter from './Routes/alert.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://railway-omega-green.vercel.app", "http://localhost:5173", "http://localhost:5174", "http://localhost:5179"],
  credentials: true,
}));
// Routes

app.use(alertRouter);

export default app;