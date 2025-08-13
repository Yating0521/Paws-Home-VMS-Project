import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Register component handles new user sign-up
export default function Register() {
  const navigate = useNavigate();

  // Local state for registration form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Update form state on input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission with basic password match validation
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.password !== form.confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      }),
    });

    if (res.status === 201) {
      alert('Registration successful!');
      navigate('/schedule');
    } else {
      const errorData = await res.json();
      alert('Registration failed: ' + (errorData.error || 'Unknown error'));
    }
  } catch (err) {
    console.error(err);
    alert('Failed to register. Please try again later.');
  }
};

  return (
    <div className="log-hours-page">
      <form className="log-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p>Sign up to join our volunteer community</p>

        <label htmlFor="name">Full Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirm">Confirm Password:</label>
        <input
          type="password"
          id="confirm"
          name="confirm"
          placeholder="Confirm your password"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <button
          className="button"
          type="submit"
          style={{
            width: "100%",
            margin: "20px 0 0 0",
            background: "#ff8800",
            padding: "15px 0",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          Create Account
        </button>

        <p style={{ textAlign: "center", marginTop: "30px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#ff8800",
              display: "block",
              marginTop: "10px",
            }}
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}