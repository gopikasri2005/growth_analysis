import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import Roadmap from "./components/Roadmap";
import Records from "./components/Records";
import Practice from "./components/Practice";
import Notes from "./components/Notes";
import Assessment from "./components/Assessment";
import AssessmentTest from "./components/AssessmentTest";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/assessments"element={ <ProtectedRoute> <Assessment/></ProtectedRoute>}/>
        <Route
  path="/assessment-test/:topic"
  element={
    <ProtectedRoute>
      <AssessmentTest />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
