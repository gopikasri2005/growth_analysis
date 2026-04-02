import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "./DashboardLayout";
import { Modal, Button, Form } from "react-bootstrap";
import Layout from "./Layout";
/* ===============================
   Skill-based Gradients
================================ */
const skillGradient = (skill) => {
  if (skill.toLowerCase().includes("frontend"))
    return "linear-gradient(135deg,#667eea,#764ba2)";
  if (skill.toLowerCase().includes("react"))
    return "linear-gradient(135deg,#00c6ff,#0072ff)";
  if (skill.toLowerCase().includes("backend"))
    return "linear-gradient(135deg,#11998e,#38ef7d)";
  if (skill.toLowerCase().includes("mongo"))
    return "linear-gradient(135deg,#56ab2f,#a8e063)";
  return "linear-gradient(135deg,#7F00FF,#E100FF)";
};

/* ===============================
   Learn Links
================================ */
const learnLinkMap = [
  { key: "HTML", url: "https://www.geeksforgeeks.org/html/html-tutorial/" },
  { key: "CSS", url: "https://www.geeksforgeeks.org/css/css-tutorial/" },
  { key: "JavaScript", url: "https://www.geeksforgeeks.org/javascript/" },
  { key: "React", url: "https://www.geeksforgeeks.org/reactjs/" },
  { key: "Node", url: "https://www.geeksforgeeks.org/nodejs/" },
  { key: "Express", url: "https://www.geeksforgeeks.org/express-js/" },
  { key: "MongoDB", url: "https://www.geeksforgeeks.org/mongodb/" }
];

const getLearnUrl = (text) => {
  const match = learnLinkMap.find((l) =>
    text.toLowerCase().includes(l.key.toLowerCase())
  );
  return match ? match.url : "https://www.geeksforgeeks.org/";
};

const Records = () => {
  
  const [records, setRecords] = useState([]);
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState({});
  const [showNote, setShowNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteFile, setNoteFile] = useState(null);
  const [noteTopic, setNoteTopic] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteError, setNoteError] = useState("");
//

  const token = localStorage.getItem("token");

  const fetchRecords = async () => {
    const res = await axios.get("http://localhost:5000/api/records", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setRecords(res.data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);
//new markcomplete
  const markComplete = async (id, subtopic) => {
    try {
      await axios.put(
        `http://localhost:5000/api/records/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRecords();
    } catch (err) {
      console.error("Error marking complete:", err);
    }
  };
//end of markcomplete
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this topic?")) return;
    await axios.delete(`http://localhost:5000/api/records/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchRecords();
  };

  const openEdit = (record) => {
    setEditData(record);
    setShow(true);
  };

  const handleEditSave = async () => {
    await axios.put(
      `http://localhost:5000/api/records/${editData._id}`,
      {
        subtopic: editData.subtopic,
        startDate: editData.startDate,
        endDate: editData.endDate
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setShow(false);
    fetchRecords();
  };

  return (
    <Layout>
      <h3 className="mb-4" style={{ color: "#6A0DAD" }}>
        My Learning Records
      </h3>

      <div className="row">
        {records.map((r) => {
          const learnUrl = r.learnLink || getLearnUrl(r.subtopic);

          return (
            <div key={r._id} className="col-md-4 mb-4">
              <div
                className="card h-100"
                style={{
                  borderRadius: "18px",
                  border: "none",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    background: skillGradient(r.skill),
                    padding: "14px 18px",
                    color: "#fff"
                  }}
                >
                  <h5 className="mb-0">{r.skill}</h5>
                </div>

                <div className="card-body">
                  <p className="fw-semibold">{r.subtopic}</p>
                  <p className="text-muted mb-1">Start: {r.startDate}</p>
                  <p className="text-muted mb-2">End: {r.endDate}</p>

                  <span
                    className={`badge ${
                      r.completed ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {r.completed ? "Completed" : "In Progress"}
                  </span>
                </div>

                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                  <div>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => {
                        setNoteTopic(r.subtopic);
                        setNoteTitle(r.subtopic + " Notes");
                        setNoteText("");
                        setNoteFile(null);
                        setNoteError("");
                        setShowNote(true);
                      }}
                    >
                      Notes
                    </button>
                    {!r.completed && (
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
onClick={() => markComplete(r._id, r.subtopic)}                      >
                        Mark Complete
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteRecord(r._id)}
                    >
                      Delete
                    </button>
                  </div>

                  <a
                    href={learnUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-dark"
                  >
                    Learn
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= EDIT MODAL ================= */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Learning Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Subtopic</Form.Label>
              <Form.Control
                value={editData.subtopic || ""}
                onChange={(e) =>
                  setEditData({ ...editData, subtopic: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={editData.startDate || ""}
                onChange={(e) =>
                  setEditData({ ...editData, startDate: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={editData.endDate || ""}
                onChange={(e) =>
                  setEditData({ ...editData, endDate: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= NOTE MODAL ================= */}
      <Modal show={showNote} onHide={() => setShowNote(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Note for: {noteTopic}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            setNoteError("");
            setSavingNote(true);
            try {
              const fd = new FormData();
              fd.append('title', noteTitle);
              fd.append('text', noteText);
              fd.append('topic', noteTopic);
              if (noteFile) fd.append('file', noteFile);

              const token = localStorage.getItem('token');
              await axios.post('http://localhost:5000/api/notes', fd, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
              });

              setShowNote(false);
              // navigate to notes page to show saved note
              window.location.href = '/notes';
            } catch (err) {
              console.error(err);
              setNoteError(err.response?.data?.message || 'Failed to save note');
            } finally {
              setSavingNote(false);
            }
          }}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Text</Form.Label>
              <Form.Control as="textarea" rows={4} value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Upload (PDF, optional)</Form.Label>
              <Form.Control type="file" accept="application/pdf" onChange={(e) => setNoteFile(e.target.files[0])} />
            </Form.Group>

            {noteError && <div className="text-danger mb-2">{noteError}</div>}

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowNote(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={savingNote}>{savingNote ? 'Saving...' : 'Save Note'}</Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

    </Layout>
    
  );
};

export default Records;
