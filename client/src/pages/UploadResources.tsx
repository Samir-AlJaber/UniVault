import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MessageOverlay from "../components/MessageOverlay";
import "../styles/upload.css";
import "../styles/overlay.css";

export default function UploadResources() {

  const [semesters, setSemesters] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
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
    const res = await fetch(`http://127.0.0.1:8000/api/courses/${selectedSemester}`);
    const data = await res.json();
    if (data.success) setCourses(data.courses);
  }

  function showOverlay(title: string, message: string) {
    setOverlayTitle(title);
    setOverlayMessage(message);
    setOverlayOpen(true);
  }

  async function handleUpload(e: any) {
    e.preventDefault();

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
    } else {
      showOverlay("Error", "Upload failed");
    }
  }

  return (
    <div>

      <Navbar />

      <div className="upload-container">

        <div className="upload-card">

          <h2>Upload Resource</h2>

          <form onSubmit={handleUpload}>

            <select value={semester} onChange={(e) => fetchCourses(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((s) => <option key={s}>{s}</option>)}
            </select>

            {courses.length > 0 && (
              <select value={course} onChange={(e) => setCourse(e.target.value)}>
                <option value="">Select Course</option>
                {courses.map((c) => <option key={c}>{c}</option>)}
              </select>
            )}

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

            <button type="submit">Upload</button>

          </form>

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