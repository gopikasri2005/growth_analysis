import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "./Layout";
import { Card, Button, ProgressBar, Badge } from "react-bootstrap";
import jsPDF from "jspdf";
const AssessmentTest = () => {
  const { topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [time, setTime] = useState(300); // 5 min timer

  const token = localStorage.getItem("token");

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/assessment/${topic}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(res.data.questions);
        setAnswers(Array(res.data.questions.length).fill(null));
      } catch (err) {
        console.error("Error loading questions", err);
      }
    };
    fetchQuestions();
  }, [topic]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (result) return;

    if (time === 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, result]);

  const formatTime = () => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ================= ANSWER ================= */
  const handleAnswer = (qIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/assessment/submit",
        { topic, answers, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
    } catch (err) {
      console.error("Submit failed", err);
    }
  };
  //certificate//
const generateCertificate = () => {
  const doc = new jsPDF("landscape");

  const userName = localStorage.getItem("name") || "Learner";
  const date = new Date().toLocaleDateString();

  // Background Border
  doc.setDrawColor(106, 13, 173); // purple
  doc.setLineWidth(3);
  doc.rect(10, 10, 277, 190);

  // Inner Border
  doc.setLineWidth(1);
  doc.rect(15, 15, 267, 180);

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(30);
  doc.setTextColor(106, 13, 173);
  doc.text("CERTIFICATE OF COMPLETION", 148, 40, null, null, "center");

  // Subtitle
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("This is to proudly certify that", 148, 60, null, null, "center");

  // Name
  doc.setFont("times", "bold");
  doc.setFontSize(26);
  doc.text(userName, 148, 80, null, null, "center");

  // Description
  doc.setFont("times", "normal");
  doc.setFontSize(14);
  doc.text("has successfully completed the", 148, 100, null, null, "center");

  // Course Name
  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.text(`${topic.toUpperCase()} ASSESSMENT`, 148, 115, null, null, "center");

  // Score
  doc.setFont("times", "normal");
  doc.setFontSize(13);
  doc.text(
    `Score: ${result.score} / ${questions.length}`,
    148,
    130,
    null,
    null,
    "center"
  );

  // Date
  doc.text(`Date: ${date}`, 50, 160);

  // Signature Line
  doc.line(200, 150, 260, 150);
  doc.text("Authorized Signature", 230, 160, null, null, "center");

  // Footer
  doc.setFontSize(10);
  doc.text("LevelUp Learning Platform", 148, 180, null, null, "center");

  doc.save(`${topic}_certificate.pdf`);

};
  /* ================= RESULT UI ================= */
  if (result) {
    return (
      <Layout>
        <div style={{ maxWidth: "600px", margin: "40px auto" }}>
          <Card className="p-4 text-center shadow-sm">
            <h2 style={{ color: "#6A0DAD" }}>🎉 Assessment Complete</h2>

            <h3 className="mt-3">
              {result.score} / {questions.length}
            </h3>

            <p>{result.percentage.toFixed(2)}%</p>

            <ProgressBar
              now={result.percentage}
              className="mb-3"
            />

            <h5>
              {result.percentage >= 80
                ? "🚀 Excellent!"
                : result.percentage >= 50
                ? "👍 Good Job!"
                : "📚 Keep Practicing!"}
            </h5>

            <p>
              Status:{" "}
              {result.passed ? "✅ Passed" : "❌ Failed"}
            </p>
{result.passed && (
  <Button
    className="mt-3"
    onClick={generateCertificate}
    style={{
      background: "linear-gradient(90deg,#00C853,#64DD17)",
      border: "none"
    }}
  >
    🎓 Download Certificate
  </Button>
)}
            <Button
              className="mt-3"
              onClick={() => window.location.reload()}
              style={{
                background: "linear-gradient(90deg,#7F00FF,#E100FF)",
                border: "none"
              }}
            >
              Retry
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <Layout>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "30px" }}>
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 style={{ color: "#6A0DAD" }}>
            📝 {topic.toUpperCase()} Assessment
          </h3>
          <Badge bg="dark">⏱ {formatTime()}</Badge>
        </div>

        {/* PROGRESS */}
        <ProgressBar
          now={
            (answers.filter((a) => a !== null).length /
              questions.length) *
            100
          }
          className="mb-4"
        />

        {/* QUESTIONS */}
        {questions.map((q, i) => (
          <Card key={i} className="mb-3 shadow-sm border-0 p-3">
            <p className="fw-bold">
              {i + 1}. {q.question}
            </p>

            {q.options.map((opt, j) => {
              const isSelected = answers[i] === j;

              return (
                <div
                  key={j}
                  onClick={() => handleAnswer(i, j)}
                  style={{
                    padding: "12px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: isSelected
                      ? "2px solid #7F00FF"
                      : "1px solid #ddd",
                    background: isSelected
                      ? "#F3E8FF"
                      : "#fff",
                    transition: "0.2s"
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background =
                        "#F9F5FF";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background =
                        "#fff";
                  }}
                >
                  {opt}
                </div>
              );
            })}
          </Card>
        ))}

        {/* SUBMIT BUTTON */}
        {questions.length > 0 && (
          <div className="text-center mt-4">
            <Button
              onClick={handleSubmit}
              size="lg"
              style={{
                background:
                  "linear-gradient(90deg,#7F00FF,#E100FF)",
                border: "none",
                padding: "12px 30px"
              }}
            >
              Submit Test 🚀
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssessmentTest;