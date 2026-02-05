import { useState, useEffect } from "react";
import './ManageUsers.css';
import UserForm from "../../Components/UserForm/UserForm";
import UserList from "../../Components/UserList/UserList";
import { fetchUsers } from "../../Service/UserService";
import { toast } from "react-toastify";

const ManageUsers = () => {
    const [users, setUser] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true);
                const response = await fetchUsers();
                setUser(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Unable to fetch users");
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, []);

    return (
        <div className="mc-page">
            <div className="mc-inner">
                <div className="mc-left">
                    <UserForm setUsers={setUser} />
                </div>

                <div className="mc-right">
                    <UserList users={users} setUsers={setUser} />
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;
