const { Log } = require('../../../logging_middleware/src');

const notifications = [
  {
    id: 1,
    type: 'Event',
    message: 'Campus fest tomorrow',
    isRead: false,
    createdAt: new Date(Date.now() - 120 * 60000)
  },
  {
    id: 2,
    type: 'Placement',
    message: 'Google interview scheduled',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60000)
  },
  {
    id: 3,
    type: 'Result',
    message: 'Semester 4 results out',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60000)
  }
];

function getPriorScore(notification) {
  let score = 0;

  if (notification.type === 'Placement')
    score += 100;
  else if (notification.type === 'Result')
    score += 50;
  else
    score += 10;

  const ageMin =
    (Date.now() - new Date(notification.createdAt).getTime()) / 60000;

  score += Math.max(0, 100 - ageMin);

  return score;
}

const showNotifications = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 3;

    await Log(
      'backend',
      'info',
      'service',
      'Fetching priority notifications'
    );

    const result = notifications
      .filter(notification => !notification.isRead)
      .map(notification => ({
        ...notification,
        priorScore: getPrior(notification)
      }))
      .sort((a, b) => b.priorScore - a.priorScore)
      .slice(0, limit);

    res.status(200).json({
      success: true,
      count: result.length,
      notifications: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addNotification = async (req, res) => {
  try {
    const { type, message } = req.body;

    const notification = {
      id: Date.now(),
      type,
      message,
      isRead: false,
      createdAt: new Date()
    };

    notifications.push(notification);

    await Log(
      'backend',
      'info',
      'service',
      'New notification created'
    );

    res.status(201).json({
      success: true,
      notification
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