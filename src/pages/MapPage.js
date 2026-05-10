import React, { useState, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "../styles/MapPage.css";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "../firebase";

// ---------------- ICONS ----------------

const iconUrls = {
  safety:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  traffic:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",

  accessibility:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",

  lighting:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",

  road:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
};

const createIcon = (type) => {

  const safeIcon =
    iconUrls[type] ||
    iconUrls["safety"];

  return new L.Icon({
    iconUrl: safeIcon,

    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],

    iconAnchor: [12, 41],
  });
};

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [30, 45],

  iconAnchor: [15, 45],
});

// ---------------- RECENTER ----------------

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);

  return null;
}

// ---------------- ADD MARKER ----------------

function AddMarker({
  addingMode,
  setShowForm,
  setSelectedPosition,
  setAddingMode,
}) {
  useMapEvents({
    click(e) {

      if (!addingMode) return;

      setSelectedPosition([
        e.latlng.lat,
        e.latlng.lng,
      ]);

      setShowForm(true);

      setAddingMode(false);
    },
  });

  return null;
}

// ---------------- MAIN ----------------

function MapPage() {

  const [reports, setReports] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [type, setType] = useState("");

  const [desc, setDesc] = useState("");

  const [addingMode, setAddingMode] =
    useState(false);

  const [selectedPosition, setSelectedPosition] =
    useState(null);

  const [userPosition, setUserPosition] =
    useState([
      22.5726,
      88.3639,
    ]);

  // ---------------- FIRESTORE ----------------

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "reports"),
      (snapshot) => {

        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        setReports(data);
      }
    );

    return () => unsubscribe();

  }, []);

  // ---------------- LOCATION ----------------

  const locateMe = () => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);

      },

      () => {

        alert("Unable to fetch location");

      }
    );
  };

  // ---------------- ADD REPORT ----------------

  const handleAddReport = async () => {

  try {

    if (!type) {
      alert("Select issue type");
      return;
    }

    if (!desc.trim()) {
      alert("Enter issue description");
      return;
    }

    if (!selectedPosition) {
      alert("Select map location");
      return;
    }

    const lat = parseFloat(
      selectedPosition[0]
    );

    const lng = parseFloat(
      selectedPosition[1]
    );

    const reportData = {
      type: type.toLowerCase(),
      desc: desc.trim(),
      lat,
      lng,
      votes: 0,
      createdAt: new Date(),
    };

    console.log(reportData);

    await addDoc(
      collection(db, "reports"),
      reportData
    );

    // RESET FORM

    setShowForm(false);

    setType("");

    setDesc("");

    setSelectedPosition(null);

    setAddingMode(false);

  } catch (error) {

    console.error(
      "Firestore Error:",
      error
    );

    alert(error.message);
  }
};
  // ---------------- UPVOTE ----------------

  const handleUpvote = async (
    reportId
  ) => {

    try {

      const reportRef = doc(
        db,
        "reports",
        reportId
      );

      await updateDoc(reportRef, {
        votes: increment(1),
      });

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div className="map-layout">

      {/* MAP */}

      <div className="map-section">

        <MapContainer
          center={userPosition}
          zoom={13}
          className="map-container"
        >

          <RecenterMap
            position={userPosition}
          />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AddMarker
            addingMode={addingMode}
            setShowForm={setShowForm}
            setSelectedPosition={
              setSelectedPosition
            }
            setAddingMode={
              setAddingMode
            }
          />

          {/* USER MARKER */}

          <Marker
            position={userPosition}
            icon={userIcon}
          >
            <Popup>
              You are here 📍
            </Popup>
          </Marker>

          {/* REPORT MARKERS */}

          {reports.map((report) => {

  const lat = Number(
    report.location?.lat ||
    report.lat
  );

  const lng = Number(
    report.location?.lng ||
    report.lng
  );

  // skip invalid coordinates
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }

  return (

    <Marker
      key={report.id}
      position={[lat, lng]}
      icon={createIcon(
        report.type
      )}
    >

      <Popup>

        <div className="popup-card">

          <h3>
            {report.type}
          </h3>

          <p>
            {report.title ||
              report.desc}
          </p>

          <p>
            👍 Votes:{" "}
            {report.votes || 0}
          </p>

          <button
            onClick={() =>
              handleUpvote(
                report.id
              )
            }
          >
            Upvote 👍
          </button>

        </div>

      </Popup>

    </Marker>
  );
})}

        </MapContainer>

        {/* LOCATION BUTTON */}

        <button
          className="locate-btn"
          onClick={locateMe}
        >
          📍
        </button>

        {/* ADD BUTTON */}

        <button
          className="floating-btn"
          onClick={() => {

            setAddingMode(true);

            alert(
              "Now click on the map to select issue location 📍"
            );

          }}
        >
          +
        </button>

      </div>

      {/* LIVE FEED */}

      <div className="feed-sidebar">

        <h2>
          🔴 Live City Feed
        </h2>

        {reports.length === 0 ? (

          <p className="empty-feed">
            No reports yet...
          </p>

        ) : (

          reports.map((report) => (

            <div
              key={report.id}
              className="feed-card"
            >

              <h3>
                {report.type ||
                  report.title}
              </h3>

              <p>
                {report.desc ||
                  report.title}
              </p>

              <span>
                👍{" "}
                {report.votes || 0}
              </span>

            </div>
          ))
        )}

      </div>

      {/* REPORT MODAL */}

      {showForm && (

        <div className="report-modal">

          <div className="report-form">

            <h2>
              Report Issue
            </h2>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Issue Type
              </option>

              <option value="safety">
                🛡️ Safety
              </option>

              <option value="traffic">
                🚦 Traffic
              </option>

              <option value="accessibility">
                ♿ Accessibility
              </option>

              <option value="lighting">
                💡 Lighting
              </option>

              <option value="road">
                🛣️ Road
              </option>

            </select>

            <textarea
              placeholder="Describe the issue..."
              value={desc}
              onChange={(e) =>
                setDesc(
                  e.target.value
                )
              }
            />

            <div className="form-buttons">

              <button
                type="button"
                className="submit-btn"
                onClick={(e) => {

                  e.preventDefault();

                  handleAddReport();

                }}
              >
                Submit Report
              </button>

              <button
                className="cancel-btn"
                onClick={() => {

                  setShowForm(false);

                  setAddingMode(false);

                  setSelectedPosition(null);

                }}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MapPage;