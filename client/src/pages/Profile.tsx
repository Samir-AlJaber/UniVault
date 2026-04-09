import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/profile.css";
import "../styles/overlay.css";

export default function Profile() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [resources, setResources] = useState<any[]>([]);

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayTitle, setOverlayTitle] = useState("");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isConfirm, setIsConfirm] = useState(false);

  useEffect(() => {
    fetchUserResources();
  }, []);

  async function fetchUserResources() {
    if (!user || !user.id) return;

    const res = await fetch(`http://127.0.0.1:8000/api/my-resources/${user.id}`);
    const data = await res.json();

    if (data.success) {
      setResources(data.resources);
    }
  }

  function openDeleteConfirm(id: number) {
    setDeleteId(id);
    setOverlayTitle("Confirm Delete");
    setOverlayMessage("Are you sure you want to delete this resource?");
    setIsConfirm(true);
    setOverlayOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    const res = await fetch(`http://127.0.0.1:8000/api/delete/${deleteId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await res.json();

    setOverlayOpen(false);

    if (data.success) {
      fetchUserResources();
    } else {
      setOverlayTitle("Error");
      setOverlayMessage(data.message);
      setIsConfirm(false);
      setOverlayOpen(true);
    }
  }

  return (
    <div>

      <Navbar />

      <div className="profile-container">

        <h2>User Profile</h2>

        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="profile-uploads">

          <h3>My Uploaded Resources ({resources.length})</h3>

          {resources.length === 0 ? (
            <p>No resources uploaded yet.</p>
          ) : (
            <div>

              {resources.map((res) => (

                <div key={res.id} className="resource-item">

                  <span>{res.title}</span>

                  <div>

                    <a
                      href={`http://127.0.0.1:8000/storage/${res.file_path}`}
                      target="_blank"
                    >
                      <button>View</button>
                    </a>

                    <button
                      style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                      onClick={() => openDeleteConfirm(res.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

      {overlayOpen && (
        <div className="overlay-backdrop">
          <div className="overlay-box">
            <h3>{overlayTitle}</h3>
            <p>{overlayMessage}</p>

            {isConfirm ? (
              <div>
                <button onClick={confirmDelete}>Confirm</button>
                <button
                  style={{ marginLeft: "10px", backgroundColor: "gray" }}
                  onClick={() => setOverlayOpen(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setOverlayOpen(false)}>OK</button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}