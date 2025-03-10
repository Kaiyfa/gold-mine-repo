// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { AlertCircle, Play, AlertTriangle } from "lucide-react";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// function OperatorDashboard() {
//     const [machines, setMachines] = useState([]);
//     const [operationData, setOperationData] = useState({
//         operator_name: "",
//         operator_id: "",
//         start_time: "",
//         end_time: "",
//     });
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchMachines();
//     }, []);

//     const fetchMachines = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("access");
//             const { data } = await axios.get("http://127.0.0.1:8000/api/machines/", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setMachines(data);
//         } catch (error) {
//             setError("Failed to fetch machines. Please try again later.");
//             console.error("Error fetching machines:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setOperationData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleStartOperation = async (machineId) => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("access");
//             await axios.put(
//                 `http://127.0.0.1:8000/api/machines/update-status/${machineId}/`,
//                 { status: "In Use", ...operationData },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             fetchMachines();
//         } catch (error) {
//             setError(error.response?.data?.error || "Error starting operation.");
//             console.error("Error starting operation:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAnomalyReport = async (machineId) => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem("access");
//             const stopTime = new Date().toISOString();
//             const issue = prompt("Please describe the issue:");
            
//             if (issue) {
//                 await axios.put(
//                     `http://127.0.0.1:8000/api/machines/report-anomaly/${machineId}/`,
//                     { stop_time: stopTime, issue },
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 fetchMachines();
//             }
//         } catch (error) {
//             setError(error.response?.data?.error || "Error reporting anomaly.");
//             console.error("Error reporting anomaly:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6">Operator Dashboard</h1>

//             {error && (
//                 <Alert variant="destructive" className="mb-4">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Error</AlertTitle>
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Machines Status</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Name</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead>Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {machines.map((machine) => (
//                                 <TableRow key={machine.id}>
//                                     <TableCell>{machine.name}</TableCell>
//                                     <TableCell>
//                                         <span className={`px-2 py-1 rounded ${
//                                             machine.status === "Available" 
//                                                 ? "bg-green-100 text-green-800" 
//                                                 : "bg-red-100 text-red-800"
//                                         }`}>
//                                             {machine.status}
//                                         </span>
//                                     </TableCell>
//                                     <TableCell>
//                                         {machine.status === "Available" ? (
//                                             <Button 
//                                                 onClick={() => handleStartOperation(machine.id)}
//                                                 disabled={loading}
//                                             >
//                                                 <Play className="mr-2 h-4 w-4" />
//                                                 Operate
//                                             </Button>
//                                         ) : (
//                                             <Button 
//                                                 variant="destructive"
//                                                 onClick={() => handleAnomalyReport(machine.id)}
//                                                 disabled={loading}
//                                             >
//                                                 <AlertTriangle className="mr-2 h-4 w-4" />
//                                                 Report Issue
//                                             </Button>
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }

// export default OperatorDashboard;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHardHat, FaSearch, FaPlay, FaStop, FaExclamationTriangle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const OperatorDashboard = () => {
    const [machines, setMachines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [operationData, setOperationData] = useState({
        machineId: null,
        operatorUsername: "",
        operatorID: "",
        startTime: "",
        endTime: "",
    });
    const [showOperationForm, setShowOperationForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeMachineId, setActiveMachineId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "operator") {
            navigate("/");
        }
        fetchMachines();
    }, [navigate]);

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

    const handleStartOperation = (machineId) => {
        setActiveMachineId(machineId);
        setOperationData({
            machineId,
            operatorUsername: "",
            operatorID: "",
            startTime: "",
            endTime: "",
        });
        setShowOperationForm(true);
    };


    const handleEndOperation = async (machineId) => {
        try {
            const token = localStorage.getItem("access");
    
            
            const endTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    
            const response = await axios.post(
                "http://127.0.0.1:8000/api/machines/end-operation/",
                { machine_id: machineId, end_time: endTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.status === 200) {
                alert(response.data.message);
    
                
                await axios.put(
                    `http://127.0.0.1:8000/api/machines/update-status/${machineId}/`,
                    { status: "Available" },  
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                fetchMachines();  
            }
        } catch (error) {
            console.error("Error ending operation:", error);
            alert(error.response?.data?.error || "Error ending operation.");
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOperationData({ ...operationData, [name]: value });
    };

    const handleSubmitOperation = async (e) => {
        e.preventDefault();
        if (!operationData.operatorUsername || !operationData.operatorID || !operationData.startTime) {
            setErrorMessage("All fields are required.");
            return;
        }
    
        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/machines/start-operation/",
                {
                    machine_id: operationData.machineId,
                    operator_username: operationData.operatorUsername,
                    operator_id: operationData.operatorID,
                    start_time: operationData.startTime,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.status === 200) {
                alert(response.data.message);
                
                // ✅ **Immediately Update Machine Status to "In Use"**
                await axios.put(
                    `http://127.0.0.1:8000/api/machines/update-status/${operationData.machineId}/`,
                    { status: "In Use" },  // 🔥 New status update
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                setShowOperationForm(false);
                setActiveMachineId(null);
                fetchMachines();  // ✅ Refresh list after update
            }
        } catch (error) {
            console.error("Error starting operation:", error);
            setErrorMessage(error.response?.data?.error || "Error starting operation.");
        }
    };
    

    const handleReportIssue = async (machineId) => {
        const issueDescription = prompt("Describe the issue:");
        if (!issueDescription) return;

        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/maintenance/report/",
                { machine_id: machineId, issue_reported: issueDescription },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.error || "Error reporting issue.");
        }
    };

    return (
        <div className="container-fluid min-vh-100" style={{ background: "#14213D", color: "white" }}>
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center p-3 bg-primary">
                <div className="d-flex align-items-center">
                    <FaHardHat size={30} className="me-2 text-warning" />
                    <h1 className="m-0 text-white">Operator Dashboard</h1>
                </div>
                <div className="input-group w-25">
                    <span className="input-group-text bg-warning"><FaSearch /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Machines"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                        }}
                    />
                </div>
            </header>

            {/* Machine List */}
            <div className="container py-4">
                <h2 className="mb-3 text-warning"><FaPlay className="me-2" /> Machines</h2>

                <div className="table-responsive">
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {machines
                                .filter((machine) =>
                                    machine.id.toString() === searchTerm.trim() ||
                                    machine.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((machine) => (
                                    <tr key={machine.id}>
                                        <td>{machine.id}</td>
                                        <td>{machine.name}</td>
                                        <td>
                                            <span className={`badge ${machine.status === "Available" ? "bg-success" : "bg-danger"}`}>
                                                {machine.status}
                                            </span>
                                        </td>
                                        <td>
                                            {machine.status === "Available" ? (
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => handleStartOperation(machine.id)}
                                                >
                                                    <FaPlay className="me-1" /> Start
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-danger btn-sm me-2"
                                                    onClick={() => handleEndOperation (machine.id)}
                                                >
                                                    <FaStop className="me-1" /> End
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleReportIssue(machine.id)}
                                            >
                                                <FaExclamationTriangle className="me-1" /> Report Issue
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Start/End Operation Form */}
            {showOperationForm && activeMachineId && (
                <div className="modal fade show d-block" style={{ background: "rgba(0, 0, 0, 0.6)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content bg-dark text-white">
                            <div className="modal-header">
                                <h5 className="modal-title">Machine Operation</h5>
                                <button type="button" className="btn-close" onClick={() => setShowOperationForm(false)}></button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                <form onSubmit={handleSubmitOperation}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            name="operatorUsername"
                                            placeholder="Operator Username"
                                            value={operationData.operatorUsername}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            name="operatorID"
                                            placeholder="Operator ID"
                                            value={operationData.operatorID}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            value={operationData.startTime}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">
                                        Confirm
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OperatorDashboard;

