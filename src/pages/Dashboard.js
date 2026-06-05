import React, { useEffect, useState } from "react";

import {
  FaTrafficLight,
  FaCloudRain,
  FaExclamationTriangle,
  FaCity,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import "../styles/Dashboard.css";

function Dashboard() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("https://citypulse-h7va.onrender.com/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) =>
        console.error("Fetch Error:", err)
      );
  }, []);

  // ---------------------------
  // COUNTS
  // ---------------------------

  const totalReports = reports.length;

  const trafficCount = reports.filter(
    (r) => r.category === "traffic"
  ).length;

  const roadCount = reports.filter(
    (r) => r.category === "road"
  ).length;

  const pendingCount = reports.filter(
    (r) => r.status === "pending"
  ).length;

  const riskScore = Math.min(
    100,
    pendingCount * 10 + totalReports * 2
  );

  const resolvedCount = reports.filter(
    (r) => r.status === "resolved"
  ).length;


  // ---------------------------
  // PIE CHART DATA
  // ---------------------------

  const incidentData = [
    {
      name: "Traffic",
      value: reports.filter(
        (r) => r.category === "traffic"
      ).length,
    },

    {
      name: "Road",
      value: reports.filter(
        (r) => r.category === "road"
      ).length,
    },

    {
      name: "Safety",
      value: reports.filter(
        (r) => r.category === "safety"
      ).length,
    },

    {
      name: "Lighting",
      value: reports.filter(
        (r) => r.category === "lighting"
      ).length,
    },

    {
      name: "Accessibility",
      value: reports.filter(
        (r) => r.category === "accessibility"
      ).length,
    },
  ];

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#ef4444",
    "#f59e0b",
    "#a855f7",
  ];

  // ---------------------------
  // WEEKLY GRAPH
  // ---------------------------

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const weeklyData = days.map((day) => ({
    day,
    reports:
      Math.floor(Math.random() * 40) + 10,
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 City Analytics</h1>

        <p>
          Smart urban monitoring and live
          analytics
        </p>
      </div>

      {/* STATS */}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaTrafficLight />
          </div>

          <div>
            <h2>{trafficCount}</h2>
            <p>Traffic Issues</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCloudRain />
          </div>

          <div>
            <h2>{roadCount}</h2>
            <p>Road Issues</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaExclamationTriangle />
          </div>

          <div>
            <h2>{totalReports}</h2>
            <p>Total Reports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaCity />
          </div>

          <div>
            <h2>{pendingCount}</h2>
            <p>Pending Reports</p>
          </div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon red">
          🚨
        </div>

        <div>
          <h2>{riskScore}%</h2>
          <p>City Risk Score</p>
        </div>
      </div>

      {/* CHARTS */}

      <div className="dashboard-grid">
        <div className="chart-card">
          <h2>
            📈 Weekly Report Activity
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <LineChart data={weeklyData}>
              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="reports"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>
            🚨 Incident Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={incidentData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {incidentData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ACTIVITY */}

      <div className="activity-section">
        <h2>
          🔴 Recent Activity
        </h2>

        <div className="activity-list">
          {reports
            .slice(0, 5)
            .map((report) => (
              <div
                className="activity-card"
                key={report._id}
              >
                📍{" "}
                {report.description ||
                  "No description"}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;