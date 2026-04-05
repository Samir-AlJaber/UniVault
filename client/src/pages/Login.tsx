import { useState } from "react";
import Navbar from "../components/Navbar";
import MessageOverlay from "../components/MessageOverlay";
import "../styles/login.css";
import "../styles/overlay.css";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState("");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [redirectAfterClose, setRedirectAfterClose] = useState(false);

  const showOverlay = (
    title: string,
    message: string,
    shouldRedirect: boolean = false
  ) => {
    setOverlayTitle(title);
    setOverlayMessage(message);
    setRedirectAfterClose(shouldRedirect);
    setOverlayOpen(true);
  };

  const handleOverlayClose = () => {
    setOverlayOpen(false);

    if (redirectAfterClose) {
      window.location.href = "/profile";
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showOverlay("Missing Information", "Please enter both email and password.");
      return;
    }

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
        showOverlay("Login Successful", "Welcome back to UniVault.", true);
      } else {
        showOverlay("Login Failed", "Invalid email or password.");
      }
    } catch (error: any) {
      console.error(error);
      showOverlay(
        "Login Failed",
        error?.response?.data?.message || "Invalid email or password."
      );
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

      <MessageOverlay
        isOpen={overlayOpen}
        title={overlayTitle}
        message={overlayMessage}
        onClose={handleOverlayClose}
      />
    </div>
  );
}