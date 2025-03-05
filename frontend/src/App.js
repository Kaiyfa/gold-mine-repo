// import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import TechnicianDashboard from "./components/TechnicianDashboard";
import OperatorDashboard from "./components/OperatorDashboard";

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/dashboard" element={<Dashboard />} />  Add Dashboard Route */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/technician-dashboard" element={<h2>Technician Dashboard</h2>} />
            <Route path="/operator-dashboard" element={<h2>Operator Dashboard</h2>} />



        </Routes>
    </Router>
);
}

export default App;


