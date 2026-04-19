import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    axios.get(`${API_URL}/api/leaderboard`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
      });

  }, []);

  return (

    <div style={{ padding: "30px" }}>

      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        🏆 Leaderboard
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
        gap: "20px"
      }}>

        {users.map((user, index) => (

          <div key={index} style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>

            {/* Profile Photo */}
            <img
              src={user.profilePic}
              alt="profile"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px"
              }}
            />

            {/* Name */}
            <h3>{user.name}</h3>

            {/* Badges */}
            <div style={{ marginTop: "10px" }}>

              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badge, i) => (

                  <span
                    key={i}
                    style={{
                      display: "inline-block",
                      background: "#6c63ff",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "20px",
                      margin: "5px",
                      fontSize: "12px"
                    }}
                  >
                    {badge}
                  </span>

                ))
              ) : (
                <p style={{ fontSize: "12px", color: "gray" }}>
                  No badges yet
                </p>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Leaderboard;