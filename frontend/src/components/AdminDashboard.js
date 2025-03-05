
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", password: "", role: "technician" });
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/"); // Redirect non-admins to login
        }

        // Fetch users from backend
        axios.get("http://127.0.0.1:8000/api/auth/users/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
        })
        .then((response) => setUsers(response.data))
        .catch((error) => console.error("Error fetching users:", error));
    }, [navigate]);

    // Handle new user form submission
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://127.0.0.1:8000/api/auth/add-user/", newUser, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
            });
            setShowModal(false);
            window.location.reload(); // Refresh page after adding user
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <button onClick={() => setShowModal(true)}>Add User</button>
            
            <h3>Existing Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.username} - {user.role}</li>
                ))}
            </ul>

            {showModal && (
                <div className="modal">
                    <h3>Add New User</h3>
                    <form onSubmit={handleAddUser}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="technician">Technician</option>
                            <option value="operator">Operator</option>
                        </select>
                        <button type="submit">Create User</button>
                        <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
