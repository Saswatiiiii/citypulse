require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("CityPulse Backend Running");
});

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
  res.json({
    message: "Backend Working",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});