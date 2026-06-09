const axios = require('axios');
require('dotenv').config();

const LogLevel = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  DEBUG: "debug",
  FATAL: "fatal"
};

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/logs'; 
let ACCESS_TOKEN = process.env.ACCESS_TOKEN || '';

async function Log(stack, level, packageName, message) {
  const payload = {
    stack,
    level,
    package:packageName,
    message,
    
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
