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

  const wrapper = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    padding: "40px",
    color: "white",
  };

  const card = {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "15px",
    backdropFilter: "blur(10px)",
  };

  const button = {
    padding: "8px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    marginTop: "10px",
  };

  return (
    <div style={wrapper}>
      <h2 style={{ marginBottom: "30px" }}>Admin Approval Panel</h2>

      {users.map((user) => (
        <div key={user.id} style={card}>
          <p><strong>{user.email}</strong></p>
          <p>Status: {user.status}</p>

          {user.status === "pending" && (
            <button style={button} onClick={() => approve(user.id)}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
