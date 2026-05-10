import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import Weather from "./pages/Weather";
import Reports from "./pages/Reports";

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

            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;