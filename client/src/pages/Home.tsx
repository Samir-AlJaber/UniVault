import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/home.css";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div>

      <Navbar />

      <section
        className="hero"
        style={{
          backgroundImage: "url('/education-bg.jpg')"
        }}
      >
        <div className="hero-content">

          <h1>Welcome to UniVault</h1>

          <p>
            A collaborative platform where students can upload, share and download academic resources semester-wise.
          </p>

          <div className="hero-buttons">
            <Link to="/resources">
              <button>Browse Resources</button>
            </Link>

            {!user && (
              <>
                <Link to="/login">
                  <button>Login</button>
                </Link>

                <Link to="/register">
                  <button>Register</button>
                </Link>
              </>
            )}
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="features">

        <h2>Why Choose UniVault?</h2>

        <div className="feature-cards">

          <div className="card">
            <h3>Semester Wise Resources</h3>
            <p>Easily find resources organized by semester and courses.</p>
          </div>

          <div className="card">
            <h3>Upload Notes</h3>
            <p>Share your notes and help others learn better.</p>
          </div>

          <div className="card">
            <h3>Download Anytime</h3>
            <p>Access academic resources anytime from anywhere.</p>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="stats-section">

        <div className="stat">
          <h3>100+</h3>
          <p>Resources</p>
        </div>

        <div className="stat">
          <h3>50+</h3>
          <p>Courses</p>
        </div>

        <div className="stat">
          <h3>1000+</h3>
          <p>Students</p>
        </div>

        <div className="stat">
          <h3>24/7</h3>
          <p>Access</p>
        </div>

      </section>

      {/* CTA */}
      <section className="cta-section">

        <h2>Start Sharing Knowledge Today</h2>

        <p>Join UniVault and help students succeed together.</p>

        <div className="cta-buttons">
          <Link to="/upload">
            <button>Upload Resource</button>
          </Link>
        </div>

      </section>

    </div>
  );
}