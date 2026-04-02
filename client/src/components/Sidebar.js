import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Roadmap", path: "/roadmap", icon: "🗺️" },
    { name: "Records", path: "/records", icon: "📚" },
    { name: "Practice", path: "/practice", icon: "💻" },
    { name: "Assessment", path: "/assessments", icon: "📝" },
    { name: "Notes", path: "/notes", icon: "📝" },
    { name: "Logout", path: "/logout", icon: "🚪" }
  ];

  const handleClick = (item) => {

    if (item.name === "Logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      navigate(item.path);
    }

  };

  return (

    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "240px",
        height: "100vh",
        background: "linear-gradient(180deg,#2E026D,#15162C)",
        padding: "25px",
        color: "#fff",
        overflowY: "auto"
      }}
    >

      <h3
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#E9D5FF"
        }}
      >
        LevelUp 🚀
      </h3>

      <Nav className="flex-column">

        {menuItems.map((item) => {

          const isActive = location.pathname === item.path;

          return (

            <Nav.Link
              key={item.name}
              onClick={() => handleClick(item)}
              style={{
                marginBottom: "12px",
                padding: "12px",
                borderRadius: "10px",
                color: "#fff",
                background: isActive ? "#7F00FF" : "transparent",
                cursor: "pointer"
              }}
            >

              {item.icon} {item.name}

            </Nav.Link>

          );

        })}

      </Nav>

    </div>

  );

};

export default Sidebar;