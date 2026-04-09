import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        background: "#222",
        color: "white"
      }}
    >
      <div>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          UniVault
        </Link>
      </div>

      <div>
        <Link to="/" style={{ marginRight: "15px", color: "white" }}>
          Home
        </Link>

        <Link to="/resources" style={{ marginRight: "15px", color: "white" }}>
          Resources
        </Link>

        <Link to="/download" style={{ marginRight: "15px", color: "white" }}>
          Download
        </Link>

        {/* ✅ Upload available for all logged-in users */}
        {user && (
          <Link to="/upload" style={{ marginRight: "15px", color: "white" }}>
            Upload
          </Link>
        )}

        {user && (
          <Link to="/profile" style={{ marginRight: "15px", color: "white" }}>
            Profile
          </Link>
        )}

        {!user && (
          <>
            <Link to="/login" style={{ marginRight: "15px", color: "white" }}>
              Login
            </Link>

            <Link to="/register" style={{ color: "white" }}>
              Register
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              marginLeft: "15px"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}