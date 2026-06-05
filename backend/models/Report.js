const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  title: String,

  description: String,

  category: String,

  firebaseId: String,

   image: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: [
      "pending",
      "in-progress",
      "resolved",
    ],
    default: "pending",
  },

  assignedTo: {
    type: String,
    default: "",
  },

  location: {
    lat: Number,
    lng: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  startedAt: {
    type: Date,
    default: null,
  },

  resolvedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model(
  "Report",
  ReportSchema
);