const Report = require("../models/Report");

const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);

    console.log("Report saved:", report._id);

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = {
      status,
    };

    if (status === "in-progress") {
      updateData.startedAt = new Date();
    }

    if (status === "resolved") {
      updateData.resolvedAt = new Date();
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus,
};