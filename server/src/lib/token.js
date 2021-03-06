const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

/**
 * JWT 토큰 생성
 * @param {any} payload
 * @returns {string} token
 */

function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, jwtSecret, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
}

exports.generateToken = generateToken;
