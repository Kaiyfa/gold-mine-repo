import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import api from "../api";
import { FaWrench, FaUserShield, FaTools, FaHardHat, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css"; 

function AdminDashboard() {
    const [machines, setMachines] = useState([]);
    const [machinesCount, setMachinesCount] = useState(0);
    const [operatorsCount, setOperatorsCount] = useState(0);
    const [techniciansCount, setTechniciansCount] = useState(0);
    const [selectedSection, setSelectedSection] = useState("machines");
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [showCreateMachineForm, setShowCreateMachineForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        manufacturer: "",
        modelNumber: "",
        type: "",
        purchaseDate: "",
        status: "Active",
    });
    const [userFormData, setUserFormData] = useState({
        username: "",
        password: "",
        role: "technician",
        idNumber: "",
    });

    const [performanceData, setPerformanceData] = useState([]); 

    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/");
        }

        fetchDashboardSummary();
        fetchMachines();
        fetchPerformanceData();
    }, [navigate]);


    const fetchPerformanceData = async () => {
        try {
            const token = localStorage.getItem("access");
            const response = await api.get("/performance/", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (response.data.length === 0) {
                console.warn("No performance data available");
            }
    
            setPerformanceData(response.data);
        } catch (error) {
            console.error("Error fetching performance data:", error);
        }
    };
    
    const performanceGraphData = {
        labels: performanceData?.map((item) => `Machine ${item.machine_id}`) || [],
        datasets: [
            {
                label: "Efficiency (%)",
                data: performanceData?.map((item) => item.efficiency) || [],
                backgroundColor: "rgba(255, 215, 0, 0.7)",
            },
        ],
    };
    
    

    const fetchDashboardSummary = async () => {
        try {
            const { data } = await api.get("dashboard/summary/");
            setMachinesCount(data.machines);
            setOperatorsCount(data.operators);
            setTechniciansCount(data.technicians);
        } catch (error) {
            console.error("Error fetching dashboard summary:", error);
        }
    };

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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCreateMachine = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/machines/",
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            alert(response.data.message);
            fetchMachines();
            setShowCreateMachineForm(false);
            setFormData({ name: "", manufacturer: "", modelNumber: "", type: "", purchaseDate: "", status: "Active" });
        } catch (error) {
            alert(error.response?.data?.error || "Error creating machine.");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access");
            const response = await axios.post(
                "http://127.0.0.1:8000/api/auth/add-user/",
                {
                    username: userFormData.username,
                    password: userFormData.password,
                    role: userFormData.role,
                    id_number: userFormData.idNumber,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(response.data.message);
            setUserFormData({ username: "", password: "", role: "technician", idNumber: "" });
        } catch (error) {
            alert(error.response?.data?.error || "Error creating user.");
        }
    };

    const handleDeleteMachine = async (id) => {
        if (window.confirm("Are you sure you want to delete this machine?")) {
            try {
                const token = localStorage.getItem("access");
                await axios.delete(`http://127.0.0.1:8000/api/machines/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setMessage("Machine deleted successfully.");
                fetchMachines();
            } catch (error) {
                setMessage("Error deleting machine.");
            }
        }
    };

    const filteredMachines = machines.filter(
        (machine) =>
            machine.id.toString().includes(searchTerm) ||
            machine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid min-vh-100" style={{ background: "linear-gradient(to bottom, #000, #333)", color: "white" }}>
            {/* Header */}
            <header className="d-flex justify-content-between align-items-center p-3 bg-black">
                <h1 className="text-warning">
                    <FaWrench className="me-2" /> Admin Dashboard
                </h1>
                <div className="input-group" style={{ maxWidth: "350px" }}>
                    <input type="text" className="form-control" placeholder="Search Machine" value={searchTerm} onChange={handleSearch} />
                    <button className="btn btn-warning" onClick={handleClearSearch}>
                        <FaSearch />
                    </button>
                </div>
            </header>

            {/* Sidebar and Main Content */}
            <div className="row flex-grow-1">
                {/* Sidebar */}
                <div className="col-md-2 p-3 bg-secondary">
                    <ul className="nav flex-column">
                        <li className={`nav-item p-2 ${selectedSection === "machines" ? "bg-warning text-dark" : "text-light"}`} onClick={() => setSelectedSection("machines")}>
                            <FaTools className="me-2" /> Machines
                        </li>
                        <li className={`nav-item p-2 ${selectedSection === "performance" ? "bg-warning text-dark" : "text-light"}`} onClick={() => setSelectedSection("performance")}>
                            <FaHardHat className="me-2" /> Performance Machine
                        </li>
                        <li className={`nav-item p-2 ${selectedSection === "createUser" ? "bg-warning text-dark" : "text-light"}`} onClick={() => setSelectedSection("createUser")}>
                            <FaUserShield className="me-2" /> Create User
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="col-md-10 p-4">
                    {/* Summary Cards */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card bg-dark text-white p-3">
                                <h3>Machines</h3>
                                <p>{machinesCount}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-dark text-white p-3">
                                <h3>Operators</h3>
                                <p>{operatorsCount}</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-dark text-white p-3">
                                <h3>Technicians</h3>
                                <p>{techniciansCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content */}
                    <div className="card p-4 bg-dark">
                        {selectedSection === "machines" && (
                            <div>
                                <h2>Machine List</h2>
                                <button
                                    className="btn btn-warning mb-3"
                                    onClick={() => setShowCreateMachineForm(!showCreateMachineForm)}
                                >
                                    {showCreateMachineForm ? "Hide Form" : "Create New Machine"}
                                </button>

                                {/* Create Machine Form */}
                                {showCreateMachineForm && (
                                    <div className="card p-3 mb-3 bg-secondary">
                                        <h3>Create a New Machine</h3>
                                        {message && <p className="text-success">{message}</p>}
                                        <form onSubmit={handleCreateMachine}>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Machine Name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="manufacturer"
                                                    placeholder="Manufacturer"
                                                    value={formData.manufacturer}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="modelNumber"
                                                    placeholder="Model Number"
                                                    value={formData.modelNumber}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="type"
                                                    placeholder="Type"
                                                    value={formData.type}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="date"
                                                    name="purchaseDate"
                                                    placeholder="Purchase Date"
                                                    value={formData.purchaseDate}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                >
                                                    <option value="Available">Available</option>
                                                    <option value="Scheduled for Maintenance">Scheduled for Maintenance</option>
                                                    <option value="Under Maintenance">Under Maintenance</option>
                                                </select>
                                            </div>
                                            <button type="submit" className="btn btn-warning">
                                                Create Machine
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger ms-2"
                                                onClick={() => setShowCreateMachineForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* Machine Table */}
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
                                        {filteredMachines.map((machine) => (
                                            <tr key={machine.id}>
                                                <td>{machine.id}</td>
                                                <td>{machine.name}</td>
                                                <td>{machine.status}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-warning me-2"
                                                        onClick={() => {
                                                            setFormData({
                                                                name: machine.name,
                                                                manufacturer: machine.manufacturer,
                                                                modelNumber: machine.modelNumber,
                                                                type: machine.type,
                                                                purchaseDate: machine.purchaseDate,
                                                                status: machine.status,
                                                            });
                                                            setShowCreateMachineForm(true);
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleDeleteMachine(machine.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {selectedSection === "performance" && (
                            <div>
                                <h2 className="text-warning">Performance Monitoring</h2>
                                {performanceData.length > 0 ? (
                                    <Bar data={performanceGraphData} />
                                ) : (
                                    <p className="text-danger">No performance data available.</p> // ✅ Prevents empty graph issue
                                )}
                            </div>
                        )}


                        {selectedSection === "createUser" && (
                            <div>
                                <h3>Create a New User</h3>
                                {message && <p className="text-success">{message}</p>}
                                <form onSubmit={handleCreateUser} className="card p-3 bg-secondary">
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Username"
                                            value={userFormData.username}
                                            onChange={handleUserInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={userFormData.password}
                                            onChange={handleUserInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <select
                                            name="role"
                                            value={userFormData.role}
                                            onChange={handleUserInputChange}
                                            className="form-control"
                                        >
                                            <option value="technician">Technician</option>
                                            <option value="operator">Operator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            name="idNumber"
                                            placeholder="ID Number"
                                            value={userFormData.idNumber}
                                            onChange={handleUserInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-warning">
                                        Create User
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;