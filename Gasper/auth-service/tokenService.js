const jwt = require('jsonwebtoken');

const validateToken = async (token) => {
  const decoded = jwt.verify(token, "visca barca");

  // Verify all required claims are present
  const requiredClaims = ['sub', 'name', 'role', 'iat', 'exp', 'iss'];
  const missingClaims = requiredClaims.filter(claim => !(claim in decoded));

  if (missingClaims.length > 0) {
    throw new Error(`Missing required claims: ${missingClaims.join(', ')}`);
  }

  // Additional validation checks
  if (decoded.exp * 1000 < Date.now()) {
    throw new jwt.TokenExpiredError('Token has expired', new Date(decoded.exp * 1000));
  }

  // Return validated token information
  return {
    success: true,
    user: {
      sub: decoded.sub,      // User ID
      name: decoded.name,    // User name
      role: decoded.role,    // User role
      iss: decoded.iss,      // Token issuer
      iat: decoded.iat,      // Issued at
      exp: decoded.exp       // Expiration
    }
  };
};

module.exports = {
  validateToken
};