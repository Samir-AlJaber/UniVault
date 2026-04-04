import Navbar from "../components/Navbar";
import "../styles/home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div>

      <Navbar />

      <section className="hero">

        <h1>Welcome to UniVault</h1>

        <p>
          A collaborative platform where students can upload, share and
          download academic resources semester-wise.
        </p>

        <div className="hero-buttons">

          <button
            onClick={() => navigate("/resources")}
          >
            Browse Resources
          </button>

          <button
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </section>


      <section className="features">

        <h2>Why Choose UniVault?</h2>

        <div className="feature-cards">

          <div className="card">
            <h3>Semester Wise Resources</h3>
            <p>
              Easily find resources organized by semester and courses.
            </p>
          </div>

          <div className="card">
            <h3>Upload Notes</h3>
            <p>
              Students can contribute notes, PDFs and study materials.
            </p>
          </div>

          <div className="card">
            <h3>Download Anytime</h3>
            <p>
              Access academic resources instantly whenever needed.
            </p>
          </div>

        </div>

      </section>


      <footer className="footer">
        <p>© 2026 UniVault. All rights reserved.</p>
      </footer>

    </div>
  );
}