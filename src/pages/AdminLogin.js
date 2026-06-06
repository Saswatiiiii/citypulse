import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);

    if (
      username === "admin" &&
      password === "citypulse123"
    ) {
      localStorage.setItem("admin", "true");
      navigate("/reports");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-card">

        <div className="admin-logo">
          🚦
        </div>

        <h1 className="admin-title">
          CityPulse Admin
        </h1>

        <p className="admin-subtitle">
          Smart City Monitoring Dashboard
        </p>

        <input
          className="admin-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="admin-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="admin-button"
          onClick={handleLogin}
        >
          Login
        </button>

        <div className="admin-footer">
          CityPulse © 2026
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;