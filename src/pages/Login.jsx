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

  if (error) {
    alert(error.message);
    return;
  }

  if (!data?.user) {
    alert("User not found after login.");
    return;
  }

  const { data: userData, error: fetchError } = await supabase
    .from("users_data")
    .select("status")
    .eq("id", data.user.id)
    .single();

  if (fetchError) {
    console.log(fetchError);
    alert("Database error.");
    return;
  }

  if (!userData || userData.status !== "approved") {
    alert("Waiting for admin approval.");
    await supabase.auth.signOut();
    return;
  }

  window.location.href = "/pass.html";
};


  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input name="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input name="password" type="password" placeholder="Password" required />
          </div>
          <button>Login</button>
        </form>
        <div className="link">
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
