import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";

const Dashboard = () => {

  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setData(res.data))
      .catch(err => console.error(err));

  }, [token]);

  if (!data) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  const inProgress = data.total - data.completed;

  const summaryCards = [
    { label: "Total Topics", value: data.total },
    { label: "Completed", value: data.completed },
    { label: "In Progress", value: inProgress },
    { label: "Overall Progress", value: `${data.progressPercent}%` }
  ];

  return (

    <Layout>

      <h3 className="mb-4" style={{ color: "#6A0DAD" }}>
        👋 Welcome Back
      </h3>

      {/* SUMMARY CARDS */}
      <div className="row mb-4">

        {summaryCards.map((c, i) => (

          <div key={i} className="col-md-3 mb-3">

            <div className="card text-center shadow-sm border-0">

              <div
                className="card-body text-white"
                style={{
                  background: "linear-gradient(90deg,#7F00FF,#E100FF)",
                  borderRadius: "12px"
                }}
              >

                <h6>{c.label}</h6>
                <h3>{c.value}</h3>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* SKILL PROGRESS */}

      <h5 className="mb-3">📊 Skill Progress</h5>

      {data.skillProgress?.map((s, i) => (

        <div key={i} className="mb-3">

          <strong>{s.skill}</strong>

          <div className="progress">

            <div
              className="progress-bar"
              style={{
                width: `${s.percent}%`,
                background: "linear-gradient(90deg,#7F00FF,#E100FF)"
              }}
            >
              {s.percent}%
            </div>

          </div>

        </div>

      ))}

      {/* IN PROGRESS TOPICS */}

      <h5 className="mt-4 mb-3">📘 In Progress Topics</h5>

      {data.activeTopics?.length === 0 && (
        <p>No active topics 🎉</p>
      )}

      <div className="row">

        {data.activeTopics?.map((t) => (

          <div key={t._id} className="col-md-4 mb-3">

            <div className="card shadow-sm h-100">

              <div className="card-body">

                <h6>{t.skill}</h6>

                <p className="text-muted">{t.subtopic}</p>

                <p>
                  📅 {t.startDate} → {t.endDate}
                </p>

                <a
                  href={t.learnLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-dark"
                >
                  Learn →
                </a>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* OVERDUE */}

      <h5 className="mt-4 mb-3 text-danger">
        ⚠️ Missed Deadlines
      </h5>

      {data.overdue?.length === 0 && (
        <p>No overdue topics 🎉</p>
      )}

      {data.overdue?.map((t) => (

        <div key={t._id} className="alert alert-danger">

          <strong>{t.subtopic}</strong> (Deadline: {t.endDate})

        </div>

      ))}

    </Layout>

  );

};

export default Dashboard;