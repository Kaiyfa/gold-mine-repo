import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin"); // Default to Admin
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
        setMenuOpen(false); // Close the menu automatically after selection
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
                username,
                password,
                role
            });
    
            console.log("API Response:", response);
    
            if (response.data && response.data.access) {
                const accessToken = response.data.access;
                const decoded = jwtDecode(accessToken);
    
                console.log("Decoded Role:", decoded.role);
                console.log("Selected Role:", role);
    
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
    
                console.log("Login successful! Redirecting...");
    
                switch (decoded.role) {
                    case "admin":
                        console.log("Navigating to /admin-dashboard");
                        navigate("/admin-dashboard");
                        break;
                    case "technician":
                        console.log("Navigating to /technician-dashboard");
                        navigate("/technician-dashboard");
                        break;
                    case "operator":
                        console.log("Navigating to /operator-dashboard");
                        navigate("/operator-dashboard");
                        break;
                    default:
                        console.error("Unexpected role received:", decoded.role);
                        setError("Unexpected error. Please try again.");
                }
            } else {
                console.error("Invalid response format:", response);
                setError("Unexpected error. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid username, password, or role.");
        }
    };



    return (
        <div style={styles.container}>
            <h2>Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Hamburger Menu Icon */}
            <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            {/* Role Selection Dropdown */}
            {menuOpen && (
                <div style={styles.menu}>
                    <p onClick={() => handleRoleSelection("admin")}>Admin</p>
                    <p onClick={() => handleRoleSelection("technician")}>Technician</p>
                    <p onClick={() => handleRoleSelection("operator")}>Operator</p>
                </div>
            )}

            {/* Show Selected Role */}
            <p>Selected Role: <strong>{role.charAt(0).toUpperCase() + role.slice(1)}</strong></p>

            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}

// CSS-in-JS styling
const styles = {
    container: { textAlign: "center", marginTop: "50px" },
    hamburger: { fontSize: "24px", cursor: "pointer", marginBottom: "10px" },
    menu: {
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        border: "1px solid black",
        background: "white",
        padding: "10px",
        width: "200px",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
    },
    form: { display: "flex", flexDirection: "column", alignItems: "center" },
    input: { padding: "10px", margin: "5px", width: "200px" },
    button: { padding: "10px", marginTop: "10px", cursor: "pointer" }
};

export default Login;
