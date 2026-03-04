import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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
      .select("status, role")
      .eq("id", data.user.id)
      .single();

    if (userData.status !== "approved") {
      alert("Waiting for admin approval.");
      await supabase.auth.signOut();
      return;
    }

    if (userData.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
      <p><Link to="/signup">Create Account</Link></p>
    </form>
  );
}