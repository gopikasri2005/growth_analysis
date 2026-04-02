import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        style={{
          marginLeft: "240px",
          width: "100%",
          minHeight: "100vh",
          background: "#EDE7F6",
          display: "flex",
          justifyContent: "center",
          padding: "40px 20px"
        }}
      >
        {/* Centered Container */}
        <div
          style={{
            width: "100%",
            maxWidth: "1000px"
          }}
        >
          {children}
        </div>

      </div>
    </div>
  );
};

export default Layout;