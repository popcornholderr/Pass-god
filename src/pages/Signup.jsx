import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    const device = navigator.userAgent;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    await supabase
      .from("users_data")
      .update({ device })
      .eq("id", data.user.id);

    alert("Signup successful. Wait for admin approval.");
    navigate("/");
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Signup</h2>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}