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

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import "../styles/Dashboard.css";

function Dashboard() {

  const [reports, setReports] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReports(data);
      }
    );

    return () => unsubscribe();

  }, []);

  // ---------------------------
  // REALTIME COUNTS
  // ---------------------------

  const totalReports = reports.length;

  const trafficCount =
    reports.filter(
      (r) => r.type === "traffic"
    ).length;

  const floodCount =
    reports.filter(
      (r) => r.type === "road"
    ).length;

  const cityEfficiency =
    totalReports === 0
      ? 100
      : Math.max(
          40,
          100 - totalReports * 2
        );

  // ---------------------------
  // PIE CHART DATA
  // ---------------------------

  const incidentData = [
    {
      name: "Safety",
      value: reports.filter(
        (r) => r.type === "safety"
      ).length,
    },

    {
      name: "Traffic",
      value: reports.filter(
        (r) => r.type === "traffic"
      ).length,
    },

    {
      name: "Lighting",
      value: reports.filter(
        (r) => r.type === "lighting"
      ).length,
    },

    {
      name: "Road",
      value: reports.filter(
        (r) => r.type === "road"
      ).length,
    },

    {
      name: "Accessibility",
      value: reports.filter(
        (r) => r.type === "accessibility"
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
      Math.floor(
        Math.random() * 40
      ) + 10,
  }));

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <h1>
          📊 City Analytics
        </h1>

        <p>
          Smart urban monitoring and live analytics
        </p>

      </div>

      {/* STATS */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            <FaTrafficLight />
          </div>

          <div>
            <h2>
              {trafficCount}
            </h2>

            <p>
              Traffic Alerts
            </p>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            <FaCloudRain />
          </div>

          <div>
            <h2>
              {floodCount}
            </h2>

            <p>
              Road Issues
            </p>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon red">
            <FaExclamationTriangle />
          </div>

          <div>
            <h2>
              {totalReports}
            </h2>

            <p>
              Emergency Reports
            </p>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon orange">
            <FaCity />
          </div>

          <div>
            <h2>
              {cityEfficiency}%
            </h2>

            <p>
              City Efficiency
            </p>
          </div>

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

            <LineChart
              data={weeklyData}
            >

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
                key={report.id}
              >

                📍{" "}

                {report.desc}

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;