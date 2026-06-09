const axios = require('axios');
require('dotenv').config();

const LogLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG"
};

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/logs'; 
let ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

/**
 * Reusable Logging Middleware Function
 * @param {string} stack - Stack trace or context
 * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
 * @param {string} packageName - Package or module name
 * @param {string} message - Log message
 */
async function Log(stack, level, packageName, message) {
  const payload = {
    stack,
    level,
    packageName,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000, 
      "axios-retry": {
        retries: 3,
        retryDelay: (retryCount) => {
          return retryCount * 1000; 
        }
      }
    });
    

    return response.data;
  } catch (error) {
    console.error(`[${level}] Failed to send log: ${message}`, error.message);
   
  }
}

module.exports = {
  Log,
  LogLevel
};
