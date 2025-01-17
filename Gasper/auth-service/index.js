const express = require('express');
const cors = require('cors');
const { validateTokenHandler } = require('./tokenController');
const { errorHandler } = require('./errorHandler');
const app = express();
const jwt = require('jsonwebtoken');

const JWT_SECRET = "visca barca" // Use the same secret as your server

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Token validation endpoint
app.post('/api/validate', validateTokenHandler);

// Error handling
app.use(errorHandler);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { userId, username, fullName, role } = req.body;

  if (!userId || !username) {
    return res.status(400).json({
      success: false,
      message: 'User ID and username are required'
    });
  }

  // Generate token
  const token = jwt.sign({
    sub: userId,
    name: fullName || username,
    role: role || 'user', // Default to 'user' if role not provided
    iss: 'auth-service',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour
  }, JWT_SECRET);

  res.json({
    success: true,
    token,
    user: {
      id: userId,
      username,
      name: fullName || username,
      role: role || 'user'
    }
  });
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});