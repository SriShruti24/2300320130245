require('dotenv').config();
const express = require('express');
const { Log, LogLevel } = require('./logger');

const app = express();
app.use(express.json());

app.post('/logs', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: "invalid token or missing" });
  }

  console.log("Log received:");
  console.log(req.body);

  
  res.status(200).json({ success: true, message: "successfully saved the log" });
});


app.get('/trigger', async (req, res) => {
  console.log("log event is triggered");
  
  await Log(
    "Error stack trace placeholder",
    LogLevel.INFO,
    "demo_app",
    "This is a demonstration of the logging middleware."
  );

  res.send('Log triggered! Check the console.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test the logger by visiting: http://localhost:${PORT}/trigger`);
});
