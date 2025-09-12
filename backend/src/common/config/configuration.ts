export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sajuboys',
  },

  jwt: {
    secret:
      process.env.JWT_SECRET ||
      'your-very-secure-secret-key-here-change-in-production',
    expiresIn: '7d',
  },

  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5177',
      'http://localhost:3000',
    ],
    credentials: true,
  },
});
