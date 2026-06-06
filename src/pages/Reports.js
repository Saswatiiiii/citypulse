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

const [
statusFilter,
setStatusFilter,
] = useState("all");

useEffect(() => {
fetch(
"https://citypulse-h7va.onrender.com/api/reports"
)
.then((res) =>
res.json()
)
.then((data) => {
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
          } else if (
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

const updateStatus =
async (
id,
status
) => {
try {
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
      async (
        docSnap
      ) => {
        const data =
          docSnap.data();

        if (
          data.desc ===
          reports.find(
            (r) =>
              r._id ===
              id
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

    setReports(
      reports.map(
        (
          report
        ) =>
          report._id ===
          id
            ? {
                ...report,
                status,
              }
            : report
      )
    );
  } catch (
    error
  ) {
    console.error(
      error
    );
  }
};

const filteredReports = reports.filter(
  (report) => {
const matchesSearch =
report.category
?.toLowerCase()
.includes(
search.toLowerCase()
) ||
report.description
?.toLowerCase()
.includes(
search.toLowerCase()
);


    const matchesStatus =
      statusFilter ===
      "all"
        ? true
        : report.status ===
          statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  }
);


return ( <div className="reports-page">

  <div className="reports-header">

    <div>
      <h1>
        🚨 City Reports
      </h1>

      <p>
        Monitor and manage
        urban incidents
        in real time
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

    <select
      className="status-filter"
      value={
        statusFilter
      }
      onChange={(e) =>
        setStatusFilter(
          e.target.value
        )
      }
    >
      <option value="all">
        All Reports
      </option>

      <option value="pending">
        Pending
      </option>

      <option value="in-progress">
        In Progress
      </option>

      <option value="resolved">
        Resolved
      </option>
    </select>

    <button
      className="logout-btn"
      onClick={() => {
        localStorage.removeItem(
          "admin"
        );

        window.location.href =
          "/admin";
      }}
    >
      Logout
    </button>

  </div>

  <div className="reports-summary">

    <div className="summary-card">
      <h2>
        {reports.length}
      </h2>
      <p>
        Total Reports
      </p>
    </div>

    <div className="summary-card">
      <h2>
        {
          reports.filter(
            (
              r
            ) =>
              r.status ===
              "pending"
          ).length
        }
      </h2>
      <p>
        Pending
      </p>
    </div>

    <div className="summary-card">
      <h2>
        {
          reports.filter(
            (
              r
            ) =>
              r.status ===
              "resolved"
          ).length
        }
      </h2>
      <p>
        Resolved
      </p>
    </div>

  </div>

  <div className="reports-grid">

    {filteredReports.map(
      (report) => (

        <div
          className="report-card"
          key={
            report._id
          }
        >

          <div className="report-top">

            <h2>
              {report.category
                ?.charAt(
                  0
                )
                .toUpperCase() +
                report.category?.slice(
                  1
                )}
            </h2>

            <span
              className={`priority ${report.priority}`}
            >
              {
                report.priority
              }
            </span>

          </div>

          <p className="report-description">
            {
              report.description
            }
          </p>

          {report.image && (
            <img
              src={
                report.image
              }
              alt="Report"
              className="report-image"
            />
          )}

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
              {report.votes ||
                0}
            </span>

          </div>

          <div className="report-bottom">

            <span
              className={`status ${report.status}`}
            >
              {
                report.status
              }
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
              <button disabled>
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
