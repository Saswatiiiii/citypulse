import React, {
  useEffect,
  useState,
} from "react";

import {
  FaMapMarkerAlt,
  FaSearch,
  FaThumbsUp,
} from "react-icons/fa";

import {
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import "../styles/Reports.css";

function Reports() {

  const [reports, setReports] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // ---------------- FETCH REPORTS ----------------

  useEffect(() => {

    
      fetch("https://citypulse-h7va.onrender.com/api/reports")
      .then((res) =>
        res.json()
      )
      .then((data) => {

         console.log(data);
        const reportsWithPriority =
          data.map(
            (report) => {

              let priority =
                "Low";

              if (
                (report.votes ||
                  0) > 8
              ) {
                priority =
                  "High";
              }

              else if (
                (report.votes ||
                  0) > 5
              ) {
                priority =
                  "Medium";
              }

              return {
                ...report,
                priority,
              };
            }
          );

        setReports(
          reportsWithPriority
        );

      })
      .catch(
        console.error
      );

  }, []);

  // ---------------- UPDATE STATUS ----------------

  const updateStatus = async (
    id,
    status
  ) => {

    try {

      // MongoDB update

      await fetch(
        `https://citypulse-h7va.onrender.com/api/reports/${id}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      // Firebase update

      const reportsRef =
        collection(
          db,
          "reports"
        );

      const snapshot =
        await getDocs(
          reportsRef
        );

      snapshot.forEach(
        async (docSnap) => {

          const data =
            docSnap.data();

          console.log(
            "Firestore:",
            data.desc,
            "Mongo:",
            reports.find((r) => r._id === id)?.description
          );  

          if (
            data.desc ===
            reports.find(
              (r) =>
                r._id === id
            )?.description
          ) {

            await updateDoc(
              docSnap.ref,
              {
                status,
              }
            );

          }

        }
      );

      // Update UI

      setReports(
        reports.map(
          (report) =>
            report._id === id
              ? {
                  ...report,
                  status,
                }
              : report
        )
      );

    } catch (error) {

      console.error(
        error
      );

    }

  };
  // ---------------- SEARCH ----------------

  const filteredReports = reports.filter(
    (report) =>
      report.status !== "resolved" &&
      report.category
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>

          <h1>
            🚨 City Reports
          </h1>

          <p>
            Monitor and manage
            real-time urban
            incidents
          </p>

        </div>

        <div className="reports-search">

          <FaSearch />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <button
          onClick={() => {
            localStorage.removeItem("admin");
            window.location.href = "/admin";
          }}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

      {/* REPORTS */}

      <div className="reports-grid">

        {filteredReports.map(
          (report) => (

            <div
              className="report-card"
              key={report._id}
            >

              {/* TOP */}

              <div className="report-top">

                <h2>

                  {report.category
                    ?.charAt(0)
                    .toUpperCase() +
                    report.category?.slice(
                      1
                    )}

                </h2>

                <span
                  className={`priority ${report.priority}`}
                >

                  {report.priority}

                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="report-description">
                {report.description}
              </p>

              {report.image && (
                <img
                  src={report.image}
                  alt="Report"
                  className="report-image"
                />
              )}

              {/* LOCATION */}

              <div className="report-info">

                <span>

                  <FaMapMarkerAlt />

                  {" "}

                  {report.location?.lat?.toFixed(
                    4
                  )}

                  ,

                  {" "}

                  {report.location?.lng?.toFixed(
                    4
                  )}

                </span>

                <span>

                  <FaThumbsUp />

                  {" "}

                  {report.votes || 0}

                </span>

              </div>

              {/* STATUS + ACTIONS */}

              <div className="report-bottom">

                <span
                  className={`status ${report.status}`}
                >

                  {report.status}

                </span>

                {report.status ===
                  "pending" && (

                  <button
                    onClick={() =>
                      updateStatus(
                        report._id,
                        "in-progress"
                      )
                    }
                  >
                    Start Work
                  </button>

                )}

                {report.status ===
                  "in-progress" && (

                  <button
                    onClick={() =>
                      updateStatus(
                        report._id,
                        "resolved"
                      )
                    }
                  >
                    Resolve
                  </button>

                )}

                {report.status ===
                  "resolved" && (

                  <button
                    disabled
                  >
                    Completed
                  </button>

                )}

              </div>

            </div>

          )
        )}

      </div>

    </div>

  );

}

export default Reports;