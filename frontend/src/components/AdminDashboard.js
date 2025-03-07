// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2"; 
import "chart.js/auto"; 
import "chart.js/auto";
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

    // Fetch dashboard summary
    const fetchDashboardSummary = async () => {
        try {
            const token = localStorage.getItem("access");
            const { data } = await axios.get("http://127.0.0.1:8000/api/dashboard/summary/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMachinesCount(data.machines);
            setOperatorsCount(data.operators);
            setTechniciansCount(data.technicians);
        } catch (error) {
            console.error("Error fetching dashboard summary:", error);
        }
    };

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

    // Fetch performance data
    const fetchPerformanceData = async () => {
        try {
            const token = localStorage.getItem("access");
            const { data } = await axios.get("http://127.0.0.1:8000/api/performance/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPerformanceData(data);
        } catch (error) {
            console.error("Error fetching performance data:", error);
        }
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle machine form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle user form input changes
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    // Create a new machine
    const handleCreateMachine = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access");
            await axios.post(
                "http://127.0.0.1:8000/api/machines/",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Machine created successfully.");
            fetchMachines(); 
            fetchDashboardSummary(); 
            setShowCreateMachineForm(false); 
            setFormData({ 
                manufacturer: "",
                modelNumber: "",
                type: "",
                purchaseDate: "",
                status: "Active",
            });
        } catch (error) {
            setMessage(error.response?.data?.error || "Error creating machine.");
        }
    };

    // Create a new user
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access");
            await axios.post(
                "http://127.0.0.1:8000/api/auth/add-user/",
                userFormData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("User created successfully.");
            fetchDashboardSummary(); 
            setUserFormData({ 
                username: "",
                password: "",
                role: "technician",
                idNumber: "",
            });
        } catch (error) {
            setMessage(error.response?.data?.error || "Error creating user.");
        }
    };

    // Delete a machine
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

    // Filter machines based on search term
    const filteredMachines = machines.filter((machine) =>
        machine.id.toString().includes(searchTerm) ||
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Performance graph data
    const performanceGraphData = {
        labels: performanceData.map((item) => `Machine ${item.machineId}`),
        datasets: [
            {
                label: "Performance (%)",
                data: performanceData.map((item) => item.performance),
                backgroundColor: "#007BFF",
            },
        ],
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.logo}>Logo</div>
                <h1 style={styles.title}>Admin Dashboard</h1>
                <input
                    type="text"
                    placeholder="Search by Machine ID or Name"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={styles.searchBar}
                />
            </header>

            {/* Sidebar */}
            <div style={styles.sidebar}>
                <ul style={styles.sidebarList}>
                    <li
                        style={
                            selectedSection === "machines"
                                ? styles.activeSidebarItem
                                : styles.sidebarItem
                        }
                        onClick={() => setSelectedSection("machines")}
                    >
                        Machines
                    </li>
                    <li
                        style={
                            selectedSection === "performance"
                                ? styles.activeSidebarItem
                                : styles.sidebarItem
                        }
                        onClick={() => setSelectedSection("performance")}
                    >
                        Performance Monitoring
                    </li>
                    <li
                        style={
                            selectedSection === "createUser"
                                ? styles.activeSidebarItem
                                : styles.sidebarItem
                        }
                        onClick={() => setSelectedSection("createUser")}
                    >
                        Create User
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Summary Cards */}
                <div style={styles.cardsContainer}>
                    <div style={styles.card}>
                        <h3>Machines</h3>
                        <p>{machinesCount}</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Operators</h3>
                        <p>{operatorsCount}</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Technicians</h3>
                        <p>{techniciansCount}</p>
                    </div>
                </div>

                {/* Dynamic Content */}
                <div style={styles.content}>
                    {selectedSection === "machines" && (
                        <div>
                            <h2>Machine List</h2>
                            <button
                                style={styles.button}
                                onClick={() => setShowCreateMachineForm(!showCreateMachineForm)}
                            >
                                {showCreateMachineForm ? "Hide Form" : "Create New Machine"}
                            </button>

                            {/* Create Machine Form */}
                            {showCreateMachineForm && (
                                <div>
                                    <h3>Create a New Machine</h3>
                                    {message && <p style={{ color: "green" }}>{message}</p>}
                                    <form onSubmit={handleCreateMachine} style={styles.form}>
                                        <input
                                            type="text"
                                            name="manufacturer"
                                            placeholder="Manufacturer"
                                            value={formData.manufacturer}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="modelNumber"
                                            placeholder="Model Number"
                                            value={formData.modelNumber}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="type"
                                            placeholder="Type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            required
                                        />
                                        <input
                                            type="date"
                                            name="purchaseDate"
                                            placeholder="Purchase Date"
                                            value={formData.purchaseDate}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            required
                                        />
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="In Maintenance">In Maintenance</option>
                                        </select>
                                        <button type="submit" style={styles.button}>
                                            Create Machine
                                        </button>
                                        <button
                                            type="button"
                                            style={styles.deleteButton}
                                            onClick={() => setShowCreateMachineForm(false)}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Machine Table */}
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
                                    {filteredMachines.map((machine) => (
                                        <tr key={machine.id}>
                                            <td>{machine.id}</td>
                                            <td>{machine.name}</td>
                                            <td>
                                                <span
                                                    style={{
                                                        color:
                                                            machine.status === "Active"
                                                                ? "green"
                                                                : machine.status === "Inactive"
                                                                ? "red"
                                                                : "yellow",
                                                    }}
                                                >
                                                    {machine.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    style={styles.updateButton}
                                                    onClick={() => {
                                                        setFormData({
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
                                                    style={styles.deleteButton}
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
                            <h2>Performance Monitoring</h2>
                            <Bar data={performanceGraphData} />
                        </div>
                    )}

                    {selectedSection === "createUser" && (
                        <div>
                            <h3>Create a New User</h3>
                            {message && <p style={{ color: "green" }}>{message}</p>}
                            <form onSubmit={handleCreateUser} style={styles.form}>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={userFormData.username}
                                    onChange={handleUserInputChange}
                                    style={styles.input}
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={userFormData.password}
                                    onChange={handleUserInputChange}
                                    style={styles.input}
                                    required
                                />
                                <select
                                    name="role"
                                    value={userFormData.role}
                                    onChange={handleUserInputChange}
                                    style={styles.input}
                                >
                                    <option value="technician">Technician</option>
                                    <option value="operator">Operator</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <input
                                    type="text"
                                    name="idNumber"
                                    placeholder="ID Number"
                                    value={userFormData.idNumber}
                                    onChange={handleUserInputChange}
                                    style={styles.input}
                                    required
                                />
                                <button type="submit" style={styles.button}>
                                    Create User
                                </button>
                                <button
                                    type="button"
                                    style={styles.deleteButton}
                                    onClick={() => setSelectedSection("machines")}
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Styles (same as before)
const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh" },
    header: {
        display: "flex",
        alignItems: "center",
        padding: "10px 20px",
        background: "#007BFF",
        color: "#fff",
    },
    logo: { marginRight: "20px", fontWeight: "bold" },
    title: { flex: 1, margin: 0 },
    searchBar: { padding: "5px", borderRadius: "5px", border: "none" },
    sidebar: { width: "200px", background: "#f8f9fa", padding: "20px" },
    sidebarList: { listStyle: "none", padding: 0 },
    sidebarItem: { padding: "10px", cursor: "pointer" },
    activeSidebarItem: { padding: "10px", cursor: "pointer", background: "#007BFF", color: "#fff" },
    mainContent: { flex: 1, padding: "20px", overflowY: "auto" },
    cardsContainer: { display: "flex", gap: "20px", marginBottom: "20px" },
    card: { background: "#ddd", padding: "20px", textAlign: "center", borderRadius: "10px", flex: 1 },
    content: { padding: "20px", background: "#fff", boxShadow: "0 0 10px rgba(0,0,0,0.1)", borderRadius: "10px" },
    table: { width: "100%", borderCollapse: "collapse" },
    updateButton: { background: "#007BFF", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" },
    deleteButton: { background: "#dc3545", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", marginLeft: "10px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" },
    input: { padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { padding: "10px", background: "#007BFF", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
};

export default AdminDashboard;