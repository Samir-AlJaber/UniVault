import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/download.css";

export default function DownloadResources() {
  const [semesters, setSemesters] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");
  const [ratingInput, setRatingInput] = useState("");
  const [selectedResource, setSelectedResource] = useState<any>(null);

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
    setSearch("");

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

  function handleDownload(id: number) {
    if (!user || !user.id) {
      setOverlayMessage("You must log in to download");
      setSelectedResource(null);
      setOverlayOpen(true);
      return;
    }

    const link = document.createElement("a");
    link.href = `http://127.0.0.1:8000/api/download/${id}`;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  let filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(search.toLowerCase())
  );

  if (sortType === "rating") {
    filteredResources = [...filteredResources].sort(
      (a, b) => (b.avg_rating || 0) - (a.avg_rating || 0)
    );
  }

  if (sortType === "newest") {
    filteredResources = [...filteredResources].sort(
      (a, b) => b.id - a.id
    );
  }

  if (sortType === "oldest") {
    filteredResources = [...filteredResources].sort(
      (a, b) => a.id - b.id
    );
  }

  async function submitRating() {
    if (!ratingInput || !selectedResource) return;

    await fetch(`http://127.0.0.1:8000/api/rate/${selectedResource.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: Number(ratingInput),
        user_id: user.id
      })
    });

    setOverlayOpen(false);
    setRatingInput("");
    setSelectedResource(null);
    fetchResources(course);
  }

  return (
    <div>
      <Navbar />

      <div className="products-container">
        <h2>Download Resources</h2>

        <div className="controls-wrapper">
          <div className="search-section">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search resource..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <h3>Select</h3>

            <div className="filter-grid">
              <select value={semester} onChange={(e) => fetchCourses(e.target.value)}>
                <option value="">Semester</option>
                {semesters.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select value={course} onChange={(e) => fetchResources(e.target.value)}>
                <option value="">Course</option>
                {courses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                <option value="">Sort</option>
                <option value="rating">By Rating</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="products-grid">
            {filteredResources.map((res) => (
              <div key={res.id} className="product-card">
                <h3>{res.title}</h3>

                <p><strong>Course:</strong> {res.course}</p>
                <p><strong>Semester:</strong> {res.semester}</p>

                <div className="card-actions">
                  <button className="buy-btn" onClick={() => handleDownload(res.id)}>
                    Download
                  </button>

                  <button className="stock-btn">
                    {res.avg_rating ? `${res.avg_rating}/10` : "New"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => {

                      if (!user || !user.id) {
                        setOverlayMessage("You must log in to rate");
                        setSelectedResource(null);
                        setOverlayOpen(true);
                        return;
                      }

                      if (res.user_id === user.id) {
                        setOverlayMessage("You cannot rate your own resource");
                        setSelectedResource(null);
                        setOverlayOpen(true);
                        return;
                      }

                      setOverlayMessage("Rate out of 10:");
                      setSelectedResource(res);
                      setOverlayOpen(true);
                    }}
                  >
                    Rate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products">No resources found</div>
        )}
      </div>

      {overlayOpen && (
        <div className="overlay-backdrop">
          <div className="overlay-box">
            <p>{overlayMessage}</p>

            {selectedResource && (
              <>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ratingInput}
                  onChange={(e) => setRatingInput(e.target.value)}
                />
                <button onClick={submitRating}>Submit</button>
              </>
            )}

            {!selectedResource && (
              <button onClick={() => setOverlayOpen(false)}>OK</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}