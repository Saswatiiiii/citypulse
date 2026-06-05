import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#07142c",
      }}
    >
      <div>
        <h2 style={{ color: "white" }}>
          Admin Login
        </h2>

        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
                setUsername(e.target.value)
            }
            />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
                setPassword(e.target.value)
            }
            />
        <button
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;