import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <Container fluid style={{ padding: 0 }}>
      <Row style={{ margin: 0 }}>
        
        {/* Sidebar */}
        <Col md={3} lg={2} style={{ padding: 0 }}>
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col
          md={9}
          lg={10}
          style={{
            background: "linear-gradient(135deg,#F6F3FF,#ECE7FF)",
            minHeight: "100vh",
            padding: "30px"
          }}
        >
          {children}
        </Col>

      </Row>
    </Container>
  );
};

export default DashboardLayout;