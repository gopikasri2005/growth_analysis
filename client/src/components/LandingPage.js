import React from "react";
import { Container, Button, Navbar, Nav, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <Navbar
        expand="lg"
        className="px-5 py-3"
        style={{
          background: "linear-gradient(90deg, #7F00FF, #E100FF)"
        }}
      >
        <Navbar.Brand className="fw-bold fs-3 text-white">
          LevelUp
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">
            <Button
              variant="outline-light"
              className="me-3 px-4"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="light"
              className="px-4 fw-semibold"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* ================= HERO ================= */}
      <section
        className="d-flex align-items-center"
        style={{
          minHeight: "85vh",
          background: "linear-gradient(135deg, #F8F6FF, #E6E6FA)"
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <h1
                className="fw-bold mb-4"
                style={{ color: "#4B0082", fontSize: "3.2rem" }}
              >
                Level Up Your Skills.  
                <br />
                Track. Learn. Succeed.
              </h1>

              <p
                className="lead mb-4"
                style={{ color: "#5E2D91", fontSize: "1.2rem" }}
              >
                LevelUp helps software developer aspirants plan their learning
                journey, track progress, meet deadlines, and grow consistently
                with a structured roadmap.
              </p>

              <div className="d-flex gap-3">
                <Button
                  size="lg"
                  style={{
                    background: "linear-gradient(90deg, #7F00FF, #E100FF)",
                    border: "none",
                    padding: "12px 30px",
                    boxShadow: "0 8px 25px rgba(127, 0, 255, 0.35)"
                  }}
                  onClick={() => navigate("/signup")}
                >
                  Get Started Free
                </Button>

                <Button
                  size="lg"
                  variant="outline-secondary"
                  style={{ padding: "12px 30px" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </Col>

            {/* RIGHT SIDE DECORATIVE CARD */}
            <Col md={5} className="mt-5 mt-md-0">
              <Card
                className="border-0 shadow-lg"
                style={{
                  borderRadius: "20px",
                  background: "white"
                }}
              >
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3" style={{ color: "#6A0DAD" }}>
                    What You Can Do 🚀
                  </h5>

                  <ul className="list-unstyled mb-0" style={{ lineHeight: "2" }}>
                    <li>📌 Build structured learning roadmaps</li>
                    <li>📅 Set timelines & track deadlines</li>
                    <li>✅ Mark progress & completion</li>
                    <li>📊 View dashboard insights</li>
                    <li>🔗 Learn from trusted resources</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-5" style={{ background: "#fff" }}>
        <Container>
          <h2
            className="text-center fw-bold mb-5"
            style={{ color: "#4B0082" }}
          >
            Why Choose LevelUp?
          </h2>

          <Row>
            {[
              {
                title: "Structured Learning",
                desc: "Follow clear roadmaps designed for developer growth."
              },
              {
                title: "Progress Tracking",
                desc: "Track completed and in-progress skills in one place."
              },
              {
                title: "Deadline Awareness",
                desc: "Never miss learning goals with deadline tracking."
              }
            ].map((f, i) => (
              <Col md={4} key={i}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{ borderRadius: "16px" }}
                >
                  <Card.Body className="p-4 text-center">
                    <h5 className="fw-bold mb-3" style={{ color: "#6A0DAD" }}>
                      {f.title}
                    </h5>
                    <p className="text-muted">{f.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ================= FOOTER ================= */}
      <footer
        className="text-center py-4"
        style={{
          background: "linear-gradient(90deg, #7F00FF, #E100FF)",
          color: "white"
        }}
      >
        <p className="mb-0">
          © {new Date().getFullYear()} LevelUp • Built for Developer Growth
        </p>
      </footer>
    </>
  );
};

export default LandingPage;
