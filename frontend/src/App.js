import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import TechnicianDashboard from "./components/TechnicianDashboard";
import OperatorDashboard from "./components/OperatorDashboard";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/technician-dashboard" element={<TechnicianDashboard />} />
                <Route path="/operator-dashboard" element={<OperatorDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
