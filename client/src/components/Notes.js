import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import Layout from "./Layout";

const Notes = () => {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ================= FETCH NOTES ================= */

  const fetchNotes = async () => {

    if (!token) return;

    try {

      const res = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotes(res.data);

    } catch (err) {

      console.error("Fetch notes error:", err);
      setError("Failed to load notes");

    }

  };

  useEffect(() => {
    fetchNotes();
  }, []);

  /* ================= SAVE NOTE ================= */

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!title && !text && !file) {
      setError("Please add note content");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const fd = new FormData();
      fd.append("title", title);
      fd.append("text", text);

      if (file) {
        fd.append("file", file);
      }

      await axios.post(
        "http://localhost:5000/api/notes",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setTitle("");
      setText("");
      setFile(null);

      fetchNotes();

    } catch (err) {

      console.error(err);
      setError(err.response?.data?.message || "Upload failed");

    } finally {

      setLoading(false);

    }

  };

  /* ================= DELETE NOTE ================= */

  const handleDelete = async (id) => {

    try {

      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchNotes();

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= DOWNLOAD FILE ================= */

  const downloadFile = async (note) => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/notes/${note._id}/file`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = note.fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error(err);
      setError("Failed to download file");

    }

  };

  return (

    <Layout>

      <div>

        <h3 style={{ color: "#6A0DAD" }} className="mb-4">
          Notes
        </h3>

        {/* ================= ADD NOTE ================= */}

        <Card className="mb-4">
          <Card.Body>

            <Form onSubmit={handleUpload}>

              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Upload PDF (optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Form.Group>

              {error && (
                <div className="text-danger mb-2">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Save Note"}
              </Button>

            </Form>

          </Card.Body>
        </Card>

        {/* ================= SAVED NOTES ================= */}

        <h5>Saved Notes</h5>

        <ListGroup>

          {notes.length === 0 && (
            <ListGroup.Item>
              No notes saved yet
            </ListGroup.Item>
          )}

          {notes.map((n) => (

            <ListGroup.Item
              key={n._id}
              className="d-flex justify-content-between align-items-start"
            >

              <div>

                <strong>{n.title || "Untitled"}</strong>

                <div>{n.text}</div>

                {n.fileName && (
                  <div>

                    <Button
                      variant="link"
                      onClick={() => downloadFile(n)}
                    >
                      Download {n.fileName}
                    </Button>

                  </div>
                )}

              </div>

              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(n._id)}
              >
                Delete
              </Button>

            </ListGroup.Item>

          ))}

        </ListGroup>

      </div>

    </Layout>

  );

};

export default Notes;