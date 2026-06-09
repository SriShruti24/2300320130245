const axios = require("axios");
const { Log } = require("../../../logging_middleware/src");

function calculateScore(notification) {
  let score = 0;

  if (notification.Type === "Placement") {
    score += 100;
  } else if (notification.Type === "Result") {
    score += 50;
  } else {
    score += 10;
  }

  const ageMinutes =
    (Date.now() - new Date(notification.Timestamp).getTime()) / 60000;

  score += Math.max(0, 100 - ageMinutes);

  return score;
}

const showNotifications = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    await Log(
      "backend",
      "info",
      "service",
      "Fetching notifications"
    );

    const response = await axios.get(
      process.env.NOTIFICATION_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }
    );

    const notifications = response.data.notifications;

    const result = notifications
      .map((notification) => ({
        ...notification,
        priorityScore: calculateScore(notification)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, limit);

    res.status(200).json({
      success: true,
      count: result.length,
      notifications: result
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    await Log(
      "backend",
      "error",
      "service",
      "Failed to fetch notifications"
    );

    res.status(500).json({
      success: false,
      message: error.response?.data || error.message
    });
  }
};

const addNotification = async (req, res) => {
  try {
    const { type, message } = req.body;

    await Log(
      "backend",
      "info",
      "service",
      "Notification created"
    );

    res.status(201).json({
      success: true,
      notification: {
        id: Date.now(),
        type,
        message
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  showNotifications,
  addNotification
};