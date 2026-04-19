import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
import Sidebar from "./Sidebar";
import Layout from "./Layout";

const topics = ["frontend", "react", "backend", "database"];

const Assessment = () => {

  const navigate = useNavigate();

  const [status, setStatus] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchStatus = async () => {

      const results = {};

      for (let topic of topics) {

        try {

          const res = await axios.get(
            `${API_URL}/api/assessment/status/${topic}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );

          results[topic] = res.data.eligible;

        } catch (err) {

          results[topic] = false;

        }

      }

      setStatus(results);

    };

    fetchStatus();

  }, [token]);

  return (

    <Layout>
      
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ padding: "40px", width: "100%" }}>

        <h2>Assessments</h2>

        <p>Select a topic to take the assessment.</p>

        <div style={{ marginTop: "30px" }}>

          {topics.map((topic) => {

            const unlocked = status[topic];

            return (

              <div
                key={topic}
                style={{
                  marginBottom: "20px",
                  padding: "20px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  background: "#fff"
                }}
              >

                <h3>{topic.toUpperCase()}</h3>

                {unlocked ? (

                  <button
                    onClick={() => navigate(`/assessment-test/${topic}`)}
                    style={{
                      background: "#7F00FF",
                      color: "#fff",
                      padding: "10px 18px",
                      border: "none",
                      borderRadius: "8px"
                    }}
                  >
                    Take Assessment
                  </button>

                ) : (

                  <button
                    disabled
                    style={{
                      background: "#ccc",
                      color: "#555",
                      padding: "10px 18px",
                      border: "none",
                      borderRadius: "8px"
                    }}
                  >
                    🔒 Assessment Locked
                  </button>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </div>
</Layout>
  );

};

export default Assessment;