import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("users_data")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data);
  };

  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel("realtime-users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users_data" },
        () => loadUsers()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const approve = async (id) => {
    await supabase.from("users_data").update({ status: "approved" }).eq("id", id);
  };

  const decline = async (id) => {
    await supabase.from("users_data").delete().eq("id", id);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {users.map((user) => (
        <div key={user.id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>
          <p>Email: {user.email}</p>
          <p>Status: {user.status}</p>
          <p>Device: {user.device}</p>
          {user.status === "pending" && (
            <>
              <button onClick={() => approve(user.id)}>Approve</button>
              <button onClick={() => decline(user.id)}>Decline</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}