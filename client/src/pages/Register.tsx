import { useState } from "react";
import Navbar from "../components/Navbar";
import MessageOverlay from "../components/MessageOverlay";
import "../styles/register.css";
import "../styles/overlay.css";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

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
      window.location.href = "/login";
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (!role) {
      showOverlay("Selection Required", "Please select Upload or Download option.");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      showOverlay("Missing Information", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      showOverlay("Password Error", "Passwords do not match.");
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

      if (response.data.success) {
        localStorage.removeItem("user");
        showOverlay("Registration Successful", "Your account has been created successfully. Please login.", true);
      } else {
        showOverlay("Registration Failed", "Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      showOverlay(
        "Registration Failed",
        error?.response?.data?.message || "An error occurred during registration."
      );
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

      <MessageOverlay
        isOpen={overlayOpen}
        title={overlayTitle}
        message={overlayMessage}
        onClose={handleOverlayClose}
      />
    </div>
  );
}