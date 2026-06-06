import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import Weather from "./pages/Weather";
import Reports from "./pages/Reports";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/App.css";
                                          
function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">

        <Sidebar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/map" element={<MapPage />} />

            <Route path="/weather" element={<Weather />} />

            <Route
                  path="/admin"
                  element={<AdminLogin />}
                />

                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  }
                />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;