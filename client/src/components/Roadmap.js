import React, { useState } from "react";
import { roadmapData } from "./RoadmapData";
import { Accordion, Card, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Layout from "./Layout";
import { API_URL } from "../api";
const Roadmap = () => {
  const token = localStorage.getItem("token");

  const [inputs, setInputs] = useState({});

  const handleChange = (category, subtopic, field, value) => {
    setInputs(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subtopic]: {
          ...prev[category]?.[subtopic],
          [field]: value
        }
      }
    }));
  };

  const handleAdd = async (category, subtopic) => {
    if (!token) return alert("Please login first");

    const startDate = inputs[category]?.[subtopic]?.start;
    const endDate = inputs[category]?.[subtopic]?.end;

    if (!startDate || !endDate) {
      return alert("Please select start and end date");
    }

    try {
      await axios.post(
        `${API_URL}/api/records`,
        {
          skill: category,
          subtopic,
          startDate,
          endDate,
          learnLink: getLearnLink(category)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Topic added successfully");

      // clear input after add
      setInputs(prev => {
        const updated = { ...prev };
        if (updated[category]) delete updated[category][subtopic];
        return updated;
      });

    } catch (err) {
      console.error(err);
      alert("Failed to add topic");
    }
  };

  const getLearnLink = (category) => {
    if (category === "HTML") {
      return "https://www.geeksforgeeks.org/html/html-tutorial/";
    }
    if (category === "CSS") {
      return "https://www.geeksforgeeks.org/css/css-tutorial/";
    }
    if (category === "JavaScript") {
      return "https://www.geeksforgeeks.org/javascript/";
    }
    return "https://www.geeksforgeeks.org/";
  };

  return (
    <Layout>
    
      <h2 style={{ color: "#6A0DAD" }}>Learning Roadmap</h2>
      <p>Select a topic, set timeline, and add it to your records.</p>

      <Accordion className="mt-4">
        {roadmapData.map((section, idx) => (
          <Accordion.Item key={idx} eventKey={idx.toString()}>
            <Accordion.Header>
              {idx + 1}. {section.category}
            </Accordion.Header>

            <Accordion.Body>
              {section.subtopics.map((subtopic, sidx) => (
                <Card key={sidx} className="mb-2 p-3">
                  <h6>{subtopic}</h6>

                  <Row className="align-items-center mt-2">
                    <Col md={4}>
                      <Form.Control
                        type="date"
                        value={inputs[section.category]?.[subtopic]?.start || ""}
                        onChange={(e) =>
                          handleChange(section.category, subtopic, "start", e.target.value)
                        }
                      />
                    </Col>

                    <Col md={4}>
                      <Form.Control
                        type="date"
                        value={inputs[section.category]?.[subtopic]?.end || ""}
                        onChange={(e) =>
                          handleChange(section.category, subtopic, "end", e.target.value)
                        }
                      />
                    </Col>

                    <Col md={4}>
                      <Button
                        onClick={() => handleAdd(section.category, subtopic)}
                        style={{
                          background: "linear-gradient(90deg, #7F00FF, #E100FF)",
                          border: "none"
                        }}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Layout>
  );
};

export default Roadmap;
