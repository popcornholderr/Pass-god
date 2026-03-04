import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [approved, setApproved] = useState(false);

  /* 🔐 AUTH + APPROVAL CHECK */
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      setEmail(user.email);

      const { data } = await supabase
        .from("users_data")
        .select("status")
        .eq("id", user.id)
        .single();

      if (!data || data.status !== "approved") {
        alert("Not approved yet 💔");
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      setApproved(true);
    };

    checkUser();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!approved) return null;

  /* PASS LOGIC */
  const pad = (n) => n.toString().padStart(2, "0");

  const now = new Date();
  const d = pad(now.getDate());
  const mo = pad(now.getMonth() + 1);
  const mTxt = now.toLocaleString("en", { month: "short" });
  const y = now.getFullYear().toString().slice(2);

  const bookingTime = `${d} ${mTxt}, ${y} | 07:00 AM`;
  const validityTime = `${d} ${mTxt}, ${y} | 11:59 PM`;

  let randomLetters = "";
  const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 5; i++)
    randomLetters += L[Math.floor(Math.random() * 26)];

  const serial = `${y}${mo}${d}0700${randomLetters}`;

  return (
    <div style={{ margin: 0, background: "hsl(206,100%,85%)", minHeight: "100vh", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 360, margin: "0 auto", padding: 16 }}>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
          <div style={{ fontSize: 22, cursor: "pointer" }} onClick={logout}>✕</div>
        </div>

        <div style={{ background: "white", borderRadius: 16, overflow: "hidden" }}>

          <div style={{ background: "#d32f2f", color: "white", textAlign: "center", padding: 5, fontSize: 22 }}>
            Rajkot Rajpath Ltd
          </div>

          <div style={{ padding: 14, display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>ID</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {email.split("@")[0].toUpperCase()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#999" }}>Fare</div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>₹25</div>
            </div>
          </div>

          <div style={{ borderTop: "1px dashed #ccc", margin: "0 12px" }} />

          <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>Booking Time</div>
              <div style={{ fontWeight: 700 }}>{bookingTime}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>Validity Time</div>
              <div style={{ fontWeight: 700 }}>{validityTime}</div>
            </div>
          </div>

          <div style={{ textAlign: "center", fontSize: 13, letterSpacing: 1, marginBottom: 10 }}>
            {serial}
          </div>

          <div style={{ background: "#d32f2f", color: "white", textAlign: "center", padding: 5 }}>
            One Day Pass
          </div>

          <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/rrl-saathi.png" alt="logo" style={{ width: 130 }} />
          </div>

        </div>

      </div>
    </div>
  );
}