import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MessageOverlay from "../components/MessageOverlay";
import "../styles/upload.css";

export default function UploadResources() {

  const [semesters, setSemesters] = useState<string[]>([]);
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [allCourses, setAllCourses] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
    setAllCourses([]);
    setFilteredCourses([]);
    setShowDropdown(false);

    const res = await fetch(`http://127.0.0.1:8000/api/courses/${selectedSemester}`);
    const data = await res.json();
    if (data.success) setAllCourses(data.courses);
  }

  function handleCourseChange(value: string) {
    setCourse(value);

    if (!value) {
      setFilteredCourses([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allCourses.filter((c) =>
      c.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredCourses(filtered);
    setShowDropdown(true);
  }

  function selectCourse(name: string) {
    setCourse(name);
    setShowDropdown(false);
  }

  function showOverlay(title: string, message: string) {
    setOverlayTitle(title);
    setOverlayMessage(message);
    setOverlayOpen(true);
  }

  async function handleUpload(e: any) {
    e.preventDefault();

    if (!user || !user.id) {
      showOverlay("Login Required", "You must log in to upload");
      return;
    }

    if (!semester || !course || !title || !file) {
      showOverlay("Missing Fields", "All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("semester", semester);
    formData.append("course", course);
    formData.append("title", title);
    formData.append("file", file);
    formData.append("user_id", user.id);

    const res = await fetch("http://127.0.0.1:8000/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      showOverlay("Success", "File uploaded");
      setSemester("");
      setCourse("");
      setTitle("");
      setFile(null);
      setFilteredCourses([]);
      setShowDropdown(false);
    } else {
      showOverlay("Error", "Upload failed");
    }
  }

  return (
    <div>

      <Navbar />

      <div className="upload-container">

        <h2>Upload Resource</h2>

        <div className="controls-wrapper">

          <div className="filter-section">

            <h3>Resource Details</h3>

            <form onSubmit={handleUpload}>

              <div className="filter-grid">

                <select value={semester} onChange={(e) => fetchCourses(e.target.value)}>
                  <option value="">Semester</option>
                  {semesters.map((s) => <option key={s}>{s}</option>)}
                </select>

                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={course}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    onFocus={() => course && setShowDropdown(true)}
                  />

                  {showDropdown && filteredCourses.length > 0 && (
                    <div className="dropdown">
                      {filteredCourses.map((c) => (
                        <div key={c} onClick={() => selectCourse(c)}>
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

              </div>

              <button className="submit-btn" type="submit">
                Upload
              </button>

            </form>

          </div>

        </div>

      </div>

      <MessageOverlay
        isOpen={overlayOpen}
        title={overlayTitle}
        message={overlayMessage}
        onClose={() => setOverlayOpen(false)}
      />

    </div>
  );
}