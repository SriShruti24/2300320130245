const { Log } = require("../../../logging_middleware/src");

const depots = {
  1: {
    id: 1,
    mechanicHours: 60,
  },
  2: {
    id: 2,
    mechanicHours: 40,
  },
};

const tasks = [
  { taskId: "T1", duration: 15, impact: 30 },
  { taskId: "T2", duration: 10, impact: 20 },
  { taskId: "T3", duration: 25, impact: 50 },
  { taskId: "T4", duration: 20, impact: 45 },
  { taskId: "T5", duration: 30, impact: 60 },
];

function solveKnapsack(tasks, hours) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill()
    .map(() => Array(hours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= hours; j++) {
      if (tasks[i - 1].duration <= j) {
        dp[i][j] = Math.max(
          tasks[i - 1].impact +
            dp[i - 1][j - tasks[i - 1].duration],
          dp[i - 1][j]
        );
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  let j = hours;
  const selected = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][j] !== dp[i - 1][j]) {
      selected.push(tasks[i - 1]);
      j -= tasks[i - 1].duration;
    }
  }

  return {
    selectedTasks: selected.reverse(),
    totalImpact: dp[n][hours],
  };
}

const getSchedule = async (req, res) => {
  try {
    const depotId = req.params.depotId;

    const depot = depots[depotId];

    if (!depot) {
      return res.status(404).json({
        message: "Depot not found",
      });
    }

    await Log(
      "backend",
      "info",
      "service",
      `Generating schedule for depot ${depotId}`
    );

    const result = solveKnapsack(
      tasks,
      depot.mechanicHours
    );

    res.json({
      depotId,
      mechanicHours: depot.mechanicHours,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSchedule,
};