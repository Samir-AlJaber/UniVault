import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/download.css";
import "../styles/overlay.css";

export default function DownloadResources() {

  const [semesters, setSemesters] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState("");
  const [overlayMessage, setOverlayMessage] = useState("");

  useEffect(() => {
    fetchSemesters();
  }, []);

  async function fetchSemesters() {
    const res = await fetch("http://127.0.0.1:8000/api/semesters");
    const data = await res.json();
    if (data.success) setSemesters(data.semesters);
  }

  async function fetchCourses(selectedSemester: string) {
    setSemester(selectedSemester);
    setCourse("");
    setResources([]);

    const res = await fetch(`http://127.0.0.1:8000/api/courses/${selectedSemester}`);
    const data = await res.json();
    if (data.success) setCourses(data.courses);
  }

  async function fetchResources(selectedCourse: string) {
    setCourse(selectedCourse);

    const res = await fetch(`http://127.0.0.1:8000/api/resources/${selectedCourse}`);
    const data = await res.json();
    if (data.success) setResources(data.resources);
  }

  function handleDownload(filePath: string) {
    if (!user || !user.id) {
      setOverlayTitle("Access Restricted");
      setOverlayMessage("You must register or login to download resources");
      setOverlayOpen(true);
      return;
    }

    window.open(`http://127.0.0.1:8000/storage/${filePath}`, "_blank");
  }

  return (
    <div>

      <Navbar />

      <div className="download-container">

        <h2>Download Resources</h2>

        <div className="form-group">
          <label>Semester</label>
          <select value={semester} onChange={(e) => fetchCourses(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((sem) => <option key={sem}>{sem}</option>)}
          </select>
        </div>

        {courses.length > 0 && (
          <div className="form-group">
            <label>Course</label>
            <select value={course} onChange={(e) => fetchResources(e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}

        {resources.length > 0 && (
          <div className="resources-list">

            {resources.map((res) => (

              <div key={res.id} className="resource-item">

                <span>{res.title}</span>

                <div>

                  <button onClick={() => handleDownload(res.file_path)}>
                    Download
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {overlayOpen && (
        <div className="overlay-backdrop">
          <div className="overlay-box">
            <h3>{overlayTitle}</h3>
            <p>{overlayMessage}</p>
            <button onClick={() => setOverlayOpen(false)}>OK</button>
          </div>
        </div>
      )}

    </div>
  );
}