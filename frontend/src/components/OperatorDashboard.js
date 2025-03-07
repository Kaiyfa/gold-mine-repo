import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OperatorDashboard() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "operator") {
            navigate("/");
            setUsername(localStorage.getItem("username"));
        }
    }, [navigate]);

    return (
        <div style={styles.container}>
            <h2>Welcome Operator {username}</h2>
            <p>This is the Operator Dashboard.</p>
            <button onClick={() => navigate("/")}>Logout</button>
        </div>
    );
}

const styles = {
    container: { textAlign: "center", marginTop: "50px" },
};

export default OperatorDashboard;
