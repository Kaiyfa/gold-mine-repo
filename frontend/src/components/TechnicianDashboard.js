import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TechnicianDashboard() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "technician") {
            navigate("/"); // Redirect to login if not a technician
        } else {
            setUsername(localStorage.getItem("username"));
        }
    }, [navigate]);

    return (
        <div style={styles.container}>
            <h2>Welcome Technician {username}</h2>
            <p>This is the Technician Dashboard.</p>
            <button onClick={() => navigate("/")}>Logout</button>
        </div>
    );
}

const styles = {
    container: { textAlign: "center", marginTop: "50px" },
};

export default TechnicianDashboard;
