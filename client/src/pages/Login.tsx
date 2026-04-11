import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/login.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password }
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/profile";
      } else {
        setMessage("Invalid credentials");
      }
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/google-login",
        { token: credentialResponse.credential }
      );

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/profile";
      }
    } catch (error) {
      setMessage("Google login failed");
    }
  };

  return (
    <div>

      <Navbar />

      <div className="login-container">

        <h2>Login</h2>

        {message && <div className="error-msg">{message}</div>}

        <div className="login-form">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <button onClick={handleLogin}>
            Login
          </button>

          <div style={{ marginTop: "20px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMessage("Google Login Failed")}
            />
          </div>

        </div>

      </div>

    </div>
  );
}