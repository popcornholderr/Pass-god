import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("users_data")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading users:", error.message);
      return;
    }

    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const approveUser = async (id) => {
    const { error } = await supabase
      .from("users_data")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Error approving user:", error.message);
      return;
    }

    loadUsers();
  };

  const deleteUser = async (id) => {
    const { error } = await supabase
      .from("users_data")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user:", error.message);
      return;
    }

    loadUsers();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Admin Approval Panel</h2>

      {users.length === 0 && <p>No users found.</p>}

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Device:</strong> {user.device}</p>
          <p><strong>Created:</strong> {user.created_at}</p>

          {user.status === "pending" && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={() => approveUser(user.id)}>
                Approve
              </button>

              <button
                onClick={() => deleteUser(user.id)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
