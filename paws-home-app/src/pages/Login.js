import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password}),
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.role, data.user_id)
        if (data.role === "admin") {
          navigate("/adminPage");
        } else {
          navigate("/schedule");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="log-hours-page">
      <form className="log-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <p>Login to access your volunteer/Admin portal</p>

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          I am Admin
        </label> */}

        <button 
          className="button" 
          type="submit"
          style={{
            width: '100%',
            margin: '20px 0 0 0',
            background: '#ff8800',
            padding: '15px 0',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          Sign In
        </button>

        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#ff8800" }}>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
