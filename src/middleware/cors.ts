import cors from 'cors';

const CORS_OPTIONS = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

if (process.env.NODE_ENV === 'production') {
  CORS_OPTIONS.origin = process.env.CORS_ORIGIN?.split(',') || [];
}

export default CORS_OPTIONS;
