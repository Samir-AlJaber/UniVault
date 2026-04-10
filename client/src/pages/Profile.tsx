import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/profile.css";

export default function Profile() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [resources, setResources] = useState<any[]>([]);
  const [message, setMessage] = useState("");

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

  async function deleteResource(id: number) {
    const res = await fetch(`http://127.0.0.1:8000/api/delete/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id })
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Deleted successfully");
      fetchUserResources();
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div>

      <Navbar />

      <div className="category-container">

        <h2>User Profile</h2>

        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {message && (
          <div className="success-msg">
            {message}
          </div>
        )}

        <div className="category-list">

          {resources.length === 0 ? (
            <div className="category-item">
              <span>No resources uploaded yet</span>
            </div>
          ) : (
            resources.map((res) => (
              <div key={res.id} className="category-item">

                <span>{res.title}</span>

                <button onClick={() => deleteResource(res.id)}>
                  Delete
                </button>

              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}