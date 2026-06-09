const express = require("express");
const router = express.Router();

const { getSchedule } = require("../controllers/scheduler");

router.get("/:depotId", getSchedule);

module.exports = router;