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
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

import "../styles/Reports.css";

function Reports() {

  const [reports, setReports] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // ---------------- REALTIME REPORTS ----------------

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "reports"),

      (snapshot) => {

        const data = snapshot.docs.map(
          (doc) => {

            const report =
              doc.data();

            let priority =
              "Low";

            if (
              report.votes > 8
            ) {
              priority =
                "High";
            }

            else if (
              report.votes > 5
            ) {
              priority =
                "Medium";
            }

            return {

              id: doc.id,

              ...report,

              priority,
            };
          }
        );

        setReports(data);
      }
    );

    return () =>
      unsubscribe();

  }, []);

  // ---------------- SEARCH ----------------

  const filteredReports =
    reports.filter((report) =>
      report.type
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
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

        {/* SEARCH */}

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

      </div>

      {/* REPORTS */}

      <div className="reports-grid">

        {filteredReports.map(
          (report) => (

            <div
              className="report-card"
              key={report.id}
            >

              {/* TOP */}

              <div className="report-top">

                <h2>

                  {report.type
                    ?.charAt(0)
                    .toUpperCase() +

                    report.type?.slice(
                      1
                    )}

                </h2>

                <span
                  className={`priority ${report.priority}`}
                >

                  {report.priority}

                </span>

              </div>

              {/* IMAGE */}

              {report.image && (

                <img
                  src={report.image}
                  alt="report"
                  className="report-image"
                />

              )}

              {/* DESCRIPTION */}

              <p className="report-description">

                {report.desc}

              </p>

              {/* INFO */}

              <div className="report-info">

                <span>

                  <FaMapMarkerAlt />

                  {report.lat?.toFixed(
                    4
                  )}

                  ,

                  {" "}

                  {report.lng?.toFixed(
                    4
                  )}

                </span>

                <span>

                  <FaThumbsUp />

                  {" "}

                  {report.votes || 0}

                </span>

              </div>

              {/* BOTTOM */}

              <div className="report-bottom">

                <span className="status Active">

                  Active

                </span>

                <button>
                  View Details
                </button>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default Reports;