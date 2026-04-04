import { useEffect, useState } from "react";
import ApiClient from "../api";

const api = new ApiClient();

export default function Home() {
  const [semesters, setSemesters] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    async function loadSemesters() {
      const data = await api.getSemesters();
      if (data && data.semesters) {
        setSemesters(data.semesters);
      }
    }

    loadSemesters();
  }, []);

  async function handleSemesterClick(semester: string) {
    setSelectedSemester(semester);
    setSelectedCourse(null);
    setResources([]);

    const data = await api.getCourses(semester);
    if (data && data.courses) {
      setCourses(data.courses);
    }
  }

  async function handleCourseClick(course: string) {
    setSelectedCourse(course);

    const data = await api.getResources(course);
    if (data && data.resources) {
      setResources(data.resources);
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>UniVault</h1>

      <h2>Select Semester</h2>

      <ul>
        {semesters.map((semester) => (
          <li
            key={semester}
            style={{ cursor: "pointer", margin: "10px 0", color: "blue" }}
            onClick={() => handleSemesterClick(semester)}
          >
            Semester {semester}
          </li>
        ))}
      </ul>

      {selectedSemester && (
        <>
          <h2>Courses for Semester {selectedSemester}</h2>

          <ul>
            {courses.map((course) => (
              <li
                key={course}
                style={{ cursor: "pointer", margin: "8px 0", color: "green" }}
                onClick={() => handleCourseClick(course)}
              >
                {course}
              </li>
            ))}
          </ul>
        </>
      )}

      {selectedCourse && (
        <>
          <h2>Resources for {selectedCourse}</h2>

          <ul>
            {resources.map((resource, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {resource.title} ({resource.type})

                <br />

                <a
                  href={`http://127.0.0.1:8000/storage/${resource.file_path}`}
                  target="_blank"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}