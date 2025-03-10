// // export default TechnicianDashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function TechnicianDashboard() {
//     const [machines, setMachines] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const navigate = useNavigate();

//     useEffect(() => {
//         const role = localStorage.getItem("role");
//         if (role !== "technician") {
//             navigate("/");
//         }
//         fetchMachines();
//     }, [navigate]);

//     //  Fetch all machines
//     const fetchMachines = async () => {
//         try {
//             const token = localStorage.getItem("access");
//             const { data } = await axios.get("http://127.0.0.1:8000/api/machines/", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setMachines(data);
//         } catch (error) {
//             console.error("Error fetching machines:", error);
//         }
//     };

//     // Handle machine status update
//     const handleUpdateStatus = async (machineId, newStatus) => {
//         console.log("🔹 Selected Status:", newStatus);
    
//         let maintenanceTime = "";
//         if (newStatus === "Under Maintenance" || newStatus === "Available") {
//             maintenanceTime = prompt(`Enter maintenance ${newStatus === "Under Maintenance" ? "start" : "end"} time (YYYY-MM-DD HH:MM:SS):`);
//             if (!maintenanceTime) {
//                 alert("Maintenance time is required.");
//                 return;
//             }
//         }
    
//         try {
//             const token = localStorage.getItem("access");
//             const response = await axios.put(
//                 `http://127.0.0.1:8000/api/machines/update-status/${machineId}/`,
//                 { status: newStatus, maintenance_time: maintenanceTime },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
    
//             console.log("Server Response:", response.data);
//             alert(response.data.message);
//             fetchMachines(); 
//         } catch (error) {
//             console.error(" Error updating machine status:", error.response?.data || error.message);
//             alert(error.response?.data?.error || "Error updating machine status.");
//         }
//     };
    
    


//     //  Handle maintenance report submission
//     const handleSubmitReport = async (machineId) => {
//         const issueReported = prompt("Describe the issue:");

//         if (!issueReported) {
//             alert("Issue report is required.");
//             return;
//         }

//         try {
//             const token = localStorage.getItem("access");
//             const response = await axios.post(
//                 "http://127.0.0.1:8000/api/maintenance/report/",
//                 { machine_id: machineId, issue_reported: issueReported },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             alert(response.data.message);
//         } catch (error) {
//             alert(error.response?.data?.error || "Error submitting maintenance report.");
//         }
//     };

//     // ✅ Filter machines based on search term
//     const filteredMachines = machines.filter((machine) =>
//         machine.id.toString().includes(searchTerm) ||
//         machine.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//             <header style={{ display: "flex", alignItems: "center", padding: "10px 20px", background: "#28A745", color: "#fff" }}>
//                 <h1 style={{ flex: 1, margin: 0 }}>Technician Dashboard</h1>
//                 <input
//                     type="text"
//                     placeholder="Search by Machine ID or Name"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{ padding: "5px", borderRadius: "5px", border: "none" }}
//                 />
//             </header>

//             <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
//                 <h2>Machine List</h2>

//                 <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
//                     <thead>
//                         <tr>
//                             <th>ID</th>
//                             <th>Name</th>
//                             <th>Status</th>
//                             <th>Start Time</th>
//                             <th>End Time</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredMachines.map((machine) => (
//                             <tr key={machine.id}>
//                                 <td>{machine.id}</td>
//                                 <td>{machine.name}</td>
//                                 <td>
//                                     <span style={{ color: machine.status === "Available" ? "green" : machine.status === "Under Maintenance" ? "yellow" : "red" }}>
//                                         {machine.status}
//                                     </span>
//                                 </td>
//                                 <td>{machine.maintenance_start_time || "N/A"}</td>
//                                 <td>{machine.maintenance_end_time || "N/A"}</td>
//                                 <td>
//                                     <select onChange={(e) => handleUpdateStatus(machine.id, e.target.value)}>
//                                         <option value="">Change Status</option>
//                                         <option value="Scheduled for Maintenance">Scheduled for Maintenance</option>
//                                         <option value="Under Maintenance">Under Maintenance</option>
//                                         <option value="Available">Available</option>
//                                     </select>

//                                     <button onClick={() => handleSubmitReport(machine.id)} style={{ background: "#FFC107", color: "#000", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginLeft: "10px" }}>
//                                         Submit Report
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </main>
//         </div>
//     );
// }

// export default TechnicianDashboard;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaWrench, FaSearch, FaTools, FaClipboardList } from "react-icons/fa"; // Icons
import "bootstrap/dist/css/bootstrap.min.css";

function TechnicianDashboard() {
    const [machines, setMachines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "technician") {
            navigate("/");
        }
        fetchMachines();
    }, [navigate]);

    // Fetch all machines
    const fetchMachines = async () => {
        try {
            const token = localStorage.getItem("access");
            const { data } = await axios.get("http://127.0.0.1:8000/api/machines/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMachines(data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };

    // Handle machine status update
    const handleUpdateStatus = async (machineId, newStatus) => {
        let maintenanceTime = "";
        if (newStatus === "Under Maintenance" || newStatus === "Available") {
            maintenanceTime = prompt(`Enter maintenance ${newStatus === "Under Maintenance" ? "start" : "end"} time (YYYY-MM-DD HH:MM:SS):`);
            if (!maintenanceTime) {
                alert("Maintenance time is required.");
                return;
            }
        }

        try {
            const token = localStorage.getItem("access");
            const response = await axios.put(
                `http://127.0.0.1:8000/api/machines/update-status/${machineId}/`,
                { status: newStatus, maintenance_time: maintenanceTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
            fetchMachines();
        } catch (error) {
            alert(error.response?.data?.error || "Error updating machine status.");
        }
    };

    // Handle maintenance report submission
    const handleSubmitReport = async (machineId) => {
        const issueReported = prompt("Describe the issue:");

        if (!issueReported) {
            alert("Issue report is required.");
            return;
        }

        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/maintenance/report/",
                { machine_id: machineId, issue_reported: issueReported },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || "Error submitting maintenance report.");
        }
    };

    // ✅ Filter machines based on search term
    const filteredMachines = machines.filter((machine) =>
        machine.id.toString().includes(searchTerm) ||
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid min-vh-100" style={{ background: "#0d1b2a", color: "white" }}>
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center p-3 bg-success">
                <div className="d-flex align-items-center">
                    <FaWrench size={30} className="me-2 text-warning" />
                    <h1 className="m-0 text-white">Technician Dashboard</h1>
                </div>
                <div className="input-group w-25">
                    <span className="input-group-text bg-warning"><FaSearch /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Machine ID or Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* Main Content */}
            <div className="container py-4">
                <h2 className="mb-3 text-warning"><FaTools className="me-2" /> Machine List</h2>

                <div className="table-responsive">
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMachines.map((machine) => (
                                <tr key={machine.id}>
                                    <td>{machine.id}</td>
                                    <td>{machine.name}</td>
                                    <td>
                                        <span className={`badge ${machine.status === "Available" ? "bg-success" : machine.status === "Under Maintenance" ? "bg-warning text-dark" : "bg-danger"}`}>
                                            {machine.status}
                                        </span>
                                    </td>
                                    <td>{machine.maintenance_start_time || "N/A"}</td>
                                    <td>{machine.maintenance_end_time || "N/A"}</td>
                                    <td>
                                        <select className="form-select" onChange={(e) => handleUpdateStatus(machine.id, e.target.value)}>
                                            <option value="">Change Status</option>
                                            <option value="Scheduled for Maintenance">Scheduled for Maintenance</option>
                                            <option value="Under Maintenance">Under Maintenance</option>
                                            <option value="Available">Available</option>
                                        </select>

                                        <button
                                            onClick={() => handleSubmitReport(machine.id)}
                                            className="btn btn-warning btn-sm ms-2"
                                        >
                                            <FaClipboardList className="me-1" /> Report Issue
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TechnicianDashboard;
