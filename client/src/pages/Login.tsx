import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/login.css";
import axios from "axios";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        {
          email,
          password
        }
      );

      if (response.data.success) {

        
        localStorage.setItem("user", JSON.stringify(response.data.user));

        alert("Login successful");

        window.location.href = "/";

      } else {
        alert("Invalid credentials");
      }

    } catch (error: any) {
      console.error(error);
      alert("Login failed");
    }
  };

  return (
    <div>

      <Navbar />

      <div className="login-container">

        <div className="login-card">

          <h2>Login to UniVault</h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

        </div>

      </div>

    </div>
  );
}