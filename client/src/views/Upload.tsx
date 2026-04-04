import { useState } from "react";

export default function Upload() {
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("PDF");
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload(e: any) {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("course", course);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/resources/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        alert("Resource uploaded successfully!");
      } else {
        console.log(data);
        alert("Upload failed");
      }

    } catch (error) {
      console.error(error);
      alert("Upload error");
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Upload Resource</h1>

      <form onSubmit={handleUpload}>

        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Course Name (example: Digital Logic)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Resource Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="PDF">PDF</option>
            <option value="Notes">Notes</option>
            <option value="Question">Question</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e: any) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit">Upload</button>

      </form>
    </div>
  );
}