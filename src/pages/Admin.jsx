  import { useEffect, useState } from "react";
  import { supabase } from "../supabaseClient";

  export default function Admin() {
    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
      const { data } = await supabase
        .from("users_data")
        .select("*")
        .order("created_at", { ascending: false });

      setUsers(data || []);
    };

    useEffect(() => {
      loadUsers();
    }, []);

    const approve = async (id) => {
      await supabase
        .from("users_data")
        .update({ status: "approved" })
        .eq("id", id);

      loadUsers();
    };

    return (
      <div className="admin-container">
        <h2>Admin Panel</h2>

        {users.map((user) => (
          <div key={user.id} className="user-card">
            <p><strong>{user.email}</strong></p>
            <p>Status: {user.status}</p>

            {user.status === "pending" && (
              <button onClick={() => approve(user.id)}>
                Approve
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }