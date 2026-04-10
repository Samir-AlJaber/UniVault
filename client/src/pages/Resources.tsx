import Navbar from "../components/Navbar";
import "../styles/resources.css";
import { useNavigate } from "react-router-dom";

export default function Resources() {

  const navigate = useNavigate();

  return (
    <div>

      <Navbar />

      <div className="category-container">

        <h2>Resources</h2>

        <div className="category-list">

          <div className="category-item">
            <span>Upload Resources</span>
            <button onClick={() => navigate("/upload")}>
              Go
            </button>
          </div>

          <div className="category-item">
            <span>Download Resources</span>
            <button onClick={() => navigate("/download")}>
              Go
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}