const express = require("express");

const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus,
} = require("../controllers/reportController");

router.get("/", getReports);

router.post("/", createReport);

router.patch(
  "/:id/status",
  updateReportStatus
);

module.exports = router;