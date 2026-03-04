import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    alert("Signup successful. Wait for approval.");
    navigate("/");
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
    background: "#22c55e",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  return (
    <div style={wrapper}>
      <div style={card}>
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input style={input} name="email" placeholder="Email" required />
          <input style={input} name="password" type="password" placeholder="Password" required />
          <button style={button}>Sign Up</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          <Link to="/" style={{ color: "#60a5fa" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
