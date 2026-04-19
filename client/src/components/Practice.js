import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Card } from "react-bootstrap";
import Layout from "./Layout";
import { API_URL } from "../api";
const Practice = () => {
  const [completed, setCompleted] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [showIdeas, setShowIdeas] = useState(false);
  const [ideasError, setIdeasError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCompleted = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompleted(res.data.filter((r) => r.completed));
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchCompleted();
  }, [fetchCompleted]);

  const handlePractice = (topic) => {
    setIdeasError("");

    const t = (topic || "").toLowerCase();

    const ideasDatabase = {
      javascript: [
        "Build a To-Do List Web App",
        "Create a Weather App using API",
        "Develop a Simple Calculator"
      ],
      react: [
        "Build a Task Manager using React",
        "Create a Movie Search App using React",
        "Develop a Notes App with Local Storage"
      ],
      python: [
        "Build a CLI To-Do List Manager",
        "Create a Password Generator",
        "Develop a Simple Web Scraper"
      ],
      html: [
        "Create a Personal Portfolio Website",
        "Build a Simple Blog Layout",
        "Design a Product Landing Page"
      ],
      css: [
        "Build a Responsive Navbar",
        "Create a CSS Image Gallery",
        "Design an Animated Loading Spinner"
      ]
    };

    let key = null;
    if (t.includes("react")) key = "react";
    else if (t.includes("python")) key = "python";
    else if (t.includes("html")) key = "html";
    else if (t.includes("css")) key = "css";
    else if (t.includes("js") || t.includes("javascript")) key = "javascript";

    const ideas = key ? ideasDatabase[key] : [
      `Build a beginner project using ${topic}`,
      `Create a small application related to ${topic}`,
      `Develop a practice project to explore ${topic}`
    ];

    setIdeas(ideas);
    setShowIdeas(true);
  };

  return (
    <Layout>
      <div>
        <h3 className="mb-4" style={{ color: "#6A0DAD" }}>
          Practice Completed Topics
        </h3>

        {completed.length === 0 ? (
          <p>No completed topics yet. Mark a topic as complete from Records to practice it.</p>
        ) : (
          <div className="row">
            {completed.map((r) => (
              <div key={r._id} className="col-md-4 mb-4">
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{r.subtopic}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {r.skill}
                    </Card.Subtitle>
                    <Card.Text>
                      Completed on: {r.endDate || "N/A"}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handlePractice(r.subtopic)}
                    >
                      Practice
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}

        <Modal show={showIdeas} onHide={() => setShowIdeas(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Project Ideas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {ideasError ? (
              <p className="text-danger">{ideasError}</p>
            ) : ideas.length > 0 ? (
              <ul className="mb-0">
                {ideas.map((idea, idx) => (
                  <li key={idx}>{idea}</li>
                ))}
              </ul>
            ) : (
              <p>No ideas yet.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowIdeas(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      
  </Layout>
  );
};

export default Practice;
