import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await axios.post("http://localhost:5000/api/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      setSuccess("Signed up successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F8F6FF, #E6E6FA)" }}>
      <Container style={{ maxWidth: "400px", backgroundColor: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
        <h2 className="text-center mb-4" style={{ color: "#6A0DAD" }}>Sign Up for LevelUp</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-3" style={{ background: "linear-gradient(90deg, #7F00FF, #E100FF)", border: "none" }}>Sign Up</Button>
        </Form>
        <p className="text-center">Already have an account? <span style={{ color: "#6A0DAD", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span></p>
      </Container>
    </section>
  );
};

export default SignupPage;
