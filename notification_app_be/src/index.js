require('dotenv').config();
const express = require('express');

const notificationRoutes = require('./routes/noti-Routes');

const app = express();

app.use(express.json());

app.use('/notifications', notificationRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});