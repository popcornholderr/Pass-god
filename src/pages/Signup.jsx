import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

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

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input name="email" placeholder="Email" required />
          </div>
          <div className="input-group">
            <input name="password" type="password" placeholder="Password" required />
          </div>
          <button>Sign Up</button>
        </form>
        <div className="link">
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}