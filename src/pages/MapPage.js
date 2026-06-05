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

import axios from "axios";

import emailjs from "@emailjs/browser";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
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

  const [image, setImage] = useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [userPosition, setUserPosition] =
    useState([
      22.5726,
      88.3639,
    ]);

  const [isSubmitting, setIsSubmitting] = useState(false);  

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

     if (isSubmitting) return;

    setIsSubmitting(true);
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

      setUploading(true);

      let imageUrl = "";

      // IMAGE UPLOAD

      if (image) {

        const formData = new FormData();

        formData.append(
          "file",
          image
        );

        formData.append(
          "upload_preset",
          "citypulse"
        );

        const response =
          await axios.post(
            "https://api.cloudinary.com/v1_1/dxmae1mqk/image/upload",
            formData
          );

        imageUrl =
          response.data.secure_url;
      }

      const lat = parseFloat(
        selectedPosition[0]
      );

      const lng = parseFloat(
        selectedPosition[1]
      );

      const reportData = {

        type:
          type.toLowerCase(),

        desc:
          desc.trim(),

        lat,

        lng,

        votes: 0,

        image: imageUrl,

        status: "pending",

        createdAt:
          serverTimestamp(),
      };

      await addDoc(
        collection(db, "reports"),
        reportData
      );

      const response = await fetch(
        "http://localhost:5000/api/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: type,
            description: desc,
            category: type,

            image: imageUrl,

            location: {
              lat,
              lng,
            },
          }),
        }
      );

      console.log("Status:", response.status);

      const result = await response.json();

      console.log("MongoDB Response:", result);

      // ---------------- EMAIL SEND ----------------

        await emailjs.send(
          "service_bv476x2",
          "template_6s3t3ms",
          {
            type: type,
            desc: desc,
            location: `${lat}, ${lng}`,
            votes: 0,
            image: imageUrl,
          },
          "Ei_hNMbMvYIF3XPvA"
        );

      // RESET

      setShowForm(false);

      setType("");

      setDesc("");

      setImage(null);

      setSelectedPosition(null);

      setAddingMode(false);

      alert(
        "Report added successfully ✅"
      );

    } catch (error) {

      console.error(error);

      alert(error.message);

    } finally {

      setUploading(false);
      setIsSubmitting(false);
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

  const activeReports = reports.filter(
    (report) =>
      report.status !== "resolved"
  );

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

          {activeReports.map((report) => {

            const lat = Number(
              report.lat
            );

            const lng = Number(
              report.lng
            );

            if (
              isNaN(lat) ||
              isNaN(lng)
            ) {
              return null;
            }

            return (

              <Marker
                key={report.id}
                position={[
                  lat,
                  lng,
                ]}
                icon={createIcon(
                  report.type
                )}
              >

                <Popup>

                  <div className="popup-card">

                    <h3>
                      {report.type
                        ?.charAt(0)
                        .toUpperCase() +
                        report.type?.slice(1)}
                    </h3>

                    <p>
                      {report.desc}
                    </p>

                    {report.image && (

                      <img
                        src={
                          report.image
                        }
                        alt="issue"
                        style={{
                          width:
                            "100%",
                          borderRadius:
                            "10px",
                          marginTop:
                            "10px",
                        }}
                      />

                    )}

                    <p>
                      👍 Votes:
                      {" "}
                      {report.votes || 0}
                    </p>

                    <button
                      className="upvote-btn"
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

        {activeReports.length === 0 ? (

          <p className="empty-feed">
            No reports yet...
          </p>

        ) : (

          activeReports.map((report) => (

            <div
              key={report.id}
              className="feed-card"
            >

              <h3>
                {report.type
                  ?.charAt(0)
                  .toUpperCase() +
                  report.type?.slice(1)}
              </h3>

              <p>
                {report.desc}
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

            {/* IMAGE INPUT */}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
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
                {uploading
                  ? "Uploading..."
                  : "Submit Report"}
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