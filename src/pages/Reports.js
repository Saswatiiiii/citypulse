import React, { useEffect, useState } from "react";

import {
  FaMapMarkerAlt,
  FaClock,
  FaSearch,
} from "react-icons/fa";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

import "../styles/Reports.css";

function Reports() {

  const [search, setSearch] = useState("");

  const [reports, setReports] = useState([]);

  useEffect(() => {

    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {

      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReports(reportsData);

    });

    return () => unsubscribe();

  }, []);

  const getPriority = (votes) => {

    if (votes > 8) {
      return "High";
    }

    else if (votes > 5) {
      return "Medium";
    }

    else {
      return "Low";
    }
  };

  const getStatus = (votes) => {

    if (votes > 8) {
      return "Active";
    }

    else if (votes > 5) {
      return "Pending";
    }

    else {
      return "Resolved";
    }
  };

  const getTimeAgo = (timestamp) => {

    if (!timestamp) return "Just now";

    const date =
      timestamp.seconds
        ? new Date(timestamp.seconds * 1000)
        : new Date(timestamp);

    const seconds =
      Math.floor((new Date() - date) / 1000);

    const minutes =
      Math.floor(seconds / 60);

    const hours =
      Math.floor(minutes / 60);

    const days =
      Math.floor(hours / 24);

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} mins ago`;
    }

    if (hours < 24) {
      return `${hours} hours ago`;
    }

    return `${days} days ago`;
  };

  const filteredReports = reports.filter((report) =>

    report.type
      ?.toLowerCase()
      .includes(search.toLowerCase())

  );

  return (
    <div className="reports-page">

      <div className="reports-header">

        <div>

          <h1>🚨 City Reports</h1>

          <p>
            Monitor and manage real-time urban incidents
          </p>

        </div>

        <div className="reports-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="reports-grid">

        {filteredReports.map((report) => (

          <div
            className="report-card"
            key={report.id}
          >

            <div className="report-top">

              <h2>
                {report.type?.charAt(0).toUpperCase() +
                  report.type?.slice(1)}
              </h2>

              <span
                className={`priority ${getPriority(
                  report.votes || 0
                )}`}
              >
                {getPriority(report.votes || 0)}
              </span>

            </div>

            <p className="report-description">

              {report.desc}

            </p>

            <div className="report-info">

              <span>
                <FaMapMarkerAlt />

                {report.lat?.toFixed(4)},
                {" "}
                {report.lng?.toFixed(4)}
              </span>

              <span>
                <FaClock />

                {getTimeAgo(report.createdAt)}
              </span>

            </div>

            <div className="report-bottom">

              <span
                className={`status ${getStatus(
                  report.votes || 0
                )}`}
              >
                {getStatus(report.votes || 0)}
              </span>

              <button>
                👍 {report.votes || 0}
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Reports;