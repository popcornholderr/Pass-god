import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function Login() {

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    const { data: userData } = await supabase
      .from("users_data")
      .select("status")
      .eq("id", data.user.id)
      .single();

    if (!userData || userData.status !== "approved") {
      alert("Waiting for admin approval.");
      await supabase.auth.signOut();
      return;
    }

    window.location.href = "/pass.html";
  };

  const wrapper = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  };

  const card = {
    width: "380px",
    padding: "40px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
    color: "white",
  };

  const input = {
    width: "100%",
    padding: "12px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.15)",
    color: "white",
  };

  const button = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input style={input} name="email" placeholder="Email" required />
          <input style={input} name="password" type="password" placeholder="Password" required />
          <button style={button}>Login</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/signup" style={{ color: "#60a5fa" }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
