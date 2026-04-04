import Navbar from "../components/Navbar";
import "../styles/resources.css";
import { useNavigate } from "react-router-dom";

export default function Resources() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div>

      <Navbar />

      <div className="resources-container">

        <h2>Resources</h2>

        <p>Select what you want to do</p>

        <div className="resource-buttons">

          {user.role !== "viewer" && (
            <button onClick={() => navigate("/upload")}>
              Upload Resources
            </button>
          )}

          <button onClick={() => navigate("/download")}>
            Download Resources
          </button>

        </div>

      </div>

    </div>
  );
}