import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { FaBars, FaUserShield, FaTools, FaHardHat, FaWrench, FaLock } from "react-icons/fa"; // ✅ Icons for roles

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin"); 
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Handle Role Selection
    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
        setMenuOpen(false);
    };

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/login/",{
                username,
                password,
                role,
            });

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("role", response.data.role);

            if (response.data && response.data.access) {
                const accessToken = response.data.access;
                const decoded = jwtDecode(accessToken);

                if (!decoded.role) {
                    setError("Invalid token format. Role is missing.");
                    return;
                }

                if (decoded.role !== role) {
                    setError("Invalid role selection. Please choose the correct role.");
                    return;
                }

                localStorage.setItem("access", accessToken);
                localStorage.setItem("refresh", response.data.refresh);
                localStorage.setItem("role", decoded.role);

                switch (decoded.role) {
                    case "admin":
                        navigate("/admin-dashboard");
                        break;
                    case "technician":
                        navigate("/technician-dashboard");
                        break;
                    case "operator":
                        navigate("/operator-dashboard");
                        break;
                    default:
                        setError("Unexpected error. Please try again.");
                }
            } else {
                setError("Unexpected error. Please try again.");
            }
        } catch (err) {
            setError("Invalid username, password, or role.");
        }
    };

    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center vh-100"
            style={{
                background: "linear-gradient(to bottom, #000, #333)",
                color: "white",
            }}
        >
            {/* Login Card */}
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px", backgroundColor: "#222" }}>
                <div className="text-center mb-4">
                    <FaWrench size={50} color="#FFD700" />
                    <h1 className="mt-3 text-warning">Mining Management System</h1>
                </div>

                {error && <div className="alert" style={{ backgroundColor: "#C00000", color: "white" }}>{error}</div>}

                {/* Hamburger Menu for Role Selection */}
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-white">Role:</span>
                    <button
                        className="btn btn-light border"
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ backgroundColor: "#333", color: "#FFD700" }}
                    >
                        <FaBars /> {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                </div>

                {/* Role Dropdown Menu */}
                {menuOpen && (
                    <div className="dropdown-menu show mt-2" style={{ backgroundColor: "#333", border: "1px solid #FFD700" }}>
                        <button
                            className="dropdown-item text-white"
                            onClick={() => handleRoleSelection("admin")}
                            style={{ backgroundColor: "#333" }}
                        >
                            <FaUserShield className="me-2" /> Admin
                        </button>
                        <button
                            className="dropdown-item text-white"
                            onClick={() => handleRoleSelection("technician")}
                            style={{ backgroundColor: "#333" }}
                        >
                            <FaTools className="me-2" /> Technician
                        </button>
                        <button
                            className="dropdown-item text-white"
                            onClick={() => handleRoleSelection("operator")}
                            style={{ backgroundColor: "#333" }}
                        >
                            <FaHardHat className="me-2" /> Operator
                        </button>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="mt-3">
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-white">
                            <FaLock /> Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-white">
                            <FaLock /> Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100"
                        style={{ backgroundColor: "#E6AC00", color: "black" }}
                    >
                        Login
                    </button>
                </form>
            </div>

            {/* Footer (Contact Section) */}
            <footer id="contact" className="mt-4 text-center">
                <p className="text-warning">© 2024 Mining System. Developed by [S267941].</p>
                <p className="text-light">Contact: S267941@uos.ac.uk | +447554935538 | Ipswich-UK_IP4-1LN</p>
            </footer>
        </div>
    );
}

export default Login;