const express = require('express');
const router = express.Router();

const {
  showNotifications,
  addNotification
} = require('../controllers/noti-controller');

router.get('/priority', showNotifications);

router.post('/', addNotification);

module.exports = router;