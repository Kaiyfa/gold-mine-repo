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



function OperatorDashboard() {
    const [machines, setMachines] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [operationData, setOperationData] = useState({
        machineId: null,
        operatorUsername: "",
        operatorID: "",
        startTime: "",
        endTime: "",
    });
    const [formData, setFormData] = useState({
        name: "", // Ensure all fields are initialized

        machineId: "",
        operatorUsername: "",
        operatorId: "",
        startTime: "",
        endTime: "",
        issueReported: ""
    });
    const [showOperationForm, setShowOperationForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "operator") {
            navigate("/");
        }
        fetchMachines();
    }, [navigate]);

    // etch all machines
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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    

    //  Start Machine Operation
    const handleStartOperation = (machineId) => {
        setOperationData({ ...operationData, machineId });
        setShowOperationForm(true);
    };

    // Submit Operation (Start or End)
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
                operationData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            setShowOperationForm(false);
            fetchMachines();
        } catch (error) {
            setErrorMessage(error.response?.data?.error || "Error starting operation.");
        }
    };

    // Submit Issue Report
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
        <div style={styles.container}>
            <h1>Operator Dashboard</h1>

            {/*  Search Machines */}
            <input
                type="text"
                placeholder="Search Machines"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Machine List */}
            <table style={styles.table}>
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
                            machine.id.toString().includes(searchTerm) ||
                            machine.name.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((machine) => (
                            <tr key={machine.id}>
                                <td>{machine.id}</td>
                                <td>{machine.name}</td>
                                <td style={{ color: machine.status === "Available" ? "green" : "red" }}>
                                    {machine.status}
                                </td>
                                <td>
                                    {machine.status === "Available" ? (
                                        <button style={styles.startButton} onClick={() => handleStartOperation(machine.id)}>
                                            Start Operation
                                        </button>
                                    ) : (
                                        <button style={styles.endButton} onClick={() => handleStartOperation(machine.id)}>
                                            End Operation
                                        </button>
                                    )}
                                    <button style={styles.reportButton} onClick={() => handleReportIssue(machine.id)}>
                                        Report Issue
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>

            {/* Start/End Operation Form */}
            {showOperationForm && (
                <div style={styles.modal}>
                    <h3>Machine Operation</h3>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    <form onSubmit={handleSubmitOperation} style={styles.form}>
                        <input
                            type="text"
                            name="operatorUsername"
                            placeholder="Operator Username"
                            value={operationData.operatorUsername}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="operatorID"
                            placeholder="Operator ID"
                            value={operationData.operatorID}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={operationData.startTime}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit" style={styles.startButton}>
                            Start
                        </button>
                        <button type="button" style={styles.endButton} onClick={() => setShowOperationForm(false)}>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

// Styles
const styles = {
    container: { padding: "20px" },
    table: { width: "100%", borderCollapse: "collapse" },
    startButton: { background: "green", color: "white", padding: "5px 10px", margin: "5px", cursor: "pointer" },
    endButton: { background: "red", color: "white", padding: "5px 10px", margin: "5px", cursor: "pointer" },
    reportButton: { background: "orange", color: "white", padding: "5px 10px", margin: "5px", cursor: "pointer" },
    modal: { background: "white", padding: "20px", position: "fixed", top: "30%", left: "30%", border: "1px solid #ccc" },
    form: { display: "flex", flexDirection: "column", gap: "10px" },
};

export default OperatorDashboard;
