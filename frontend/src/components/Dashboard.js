import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Dashboard() {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get the access token from localStorage
        const token = localStorage.getItem("access");

        if (!token) {
            navigate("/"); // Redirect to login if no token found
        } else {
            try {
                // Decode token to extract user role
                const decoded = jwtDecode(token);
                setRole(decoded.role);
            } catch (error) {
                console.error("Invalid token", error);
                navigate("/");
            }
        }
    }, [navigate]);

    return (
        <div>
            <h2>Welcome to the Dashboard</h2>
            {role === "admin" && <p>You have full admin access.</p>}
            {role === "technician" && <p>You can access maintenance schedules.</p>}
            {role === "operator" && <p>You can log machinery usage.</p>}
            {!role && <p>Loading...</p>}
        </div>
    );
}

export default Dashboard;
