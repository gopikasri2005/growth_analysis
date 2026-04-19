import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      setSuccess("Logged in successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #F8F6FF, #E6E6FA)" }}>
      <Container style={{ maxWidth: "400px", backgroundColor: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
        <h2 className="text-center mb-4" style={{ color: "#6A0DAD" }}>Login to LevelUp</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-3" style={{ background: "linear-gradient(90deg, #7F00FF, #E100FF)", border: "none" }}>Login</Button>
        </Form>
        <p className="text-center">Don’t have an account? <span style={{ color: "#6A0DAD", cursor: "pointer" }} onClick={() => navigate("/signup")}>Sign Up</span></p>
      </Container>
    </section>
  );
};

export default LoginPage;
