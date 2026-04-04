import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/register.css";
import axios from "axios";

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault(); // 🔥 IMPORTANT

    if (!role) {
      alert("Please select Upload or Download option");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        {
          name,
          email,
          password,
          role
        }
      );

      console.log(response.data);

      if (response.data.success) {
        alert("Registration successful ✅");

        
        localStorage.setItem("user", JSON.stringify(response.data.user));

        window.location.href = "/login";
      } else {
        alert("Registration failed ❌");
      }

    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div>

      <Navbar />

      <div className="register-container">

        <div className="register-card">

          <h2>Create UniVault Account</h2>

       
          <div style={{ marginBottom: "15px" }}>

            <button
              type="button"
              onClick={() => setRole("uploader")}
              style={{
                marginRight: "10px",
                backgroundColor: role === "uploader" ? "green" : "#ccc",
                padding: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Upload Resource
            </button>

            <button
              type="button"
              onClick={() => setRole("viewer")}
              style={{
                backgroundColor: role === "viewer" ? "blue" : "#ccc",
                padding: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Download Resource
            </button>

          </div>

         
          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" className="register-btn">
              Register
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}