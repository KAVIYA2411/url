import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sun from "../assets/sun.png";
import cuv_Image from "../assets/cuv.png";
import Image6 from "../assets/Frame_(1).png";
import Image1 from "../assets/Icons_(1).svg";
import Image2 from "../assets/Icons_(2).svg";
import Image3 from "../assets/Icons_(3).svg";
import Image4 from "../assets/Icons.svg";
import Image9 from "../assets/Vector_(4).png";
import Image10 from "../assets/Vector_(5).png";

const AnalyticsPage = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [links, setLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedLinks = JSON.parse(localStorage.getItem("links")) || [];
    setLinks(storedLinks);

    updateGreeting();
    const interval = setInterval(updateGreeting, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (searchTerm) {
      navigate("/links");
    }
  }, [searchTerm, navigate]);

  const updateGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const day = now.toLocaleDateString("en-US", { weekday: "short" });
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    setCurrentTime(`${day}, ${date} | ${timeString}`);
  };


  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5);

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = links.slice(indexOfFirstLink, indexOfLastLink);

  const totalPages = Math.ceil(links.length / linksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img className="cuv_image" src={cuv_Image} alt="Cuvette logo" />
        <ul className="sidebar-menu">
          <li>
            <button className="sidebar-link-button" onClick={() => navigate("/dashboard")}>
              <img className="image1" src={Image4} alt="Dashboard" />Dashboard
            </button>
          </li>
          <li>
            <button className="sidebar-link-button" onClick={() => navigate("/links")}>
              <img className="image1" src={Image1} alt="Links" />Links
            </button>
          </li>
          <li>
            <button className="sidebar-link-button active" onClick={() => navigate("/analytics")}>
              <img className="image1" src={Image2} alt="Analytics" />Analytics
            </button>
          </li>
          <li><hr></hr>
            <button className="sidebar-link-button" onClick={() => navigate("/settings")}>
              <img className="image1" src={Image3} alt="Settings" />Settings
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="navbar">
          <div className="greeting">
            <h3><img className="sun" src={sun} alt="Sun icon" /> {greeting}, {username || "User"}</h3>
            <p className="time">{currentTime}</p>
          </div>
          <div className="navbar-actions">
            <button className="create-link-button" onClick={() => navigate("/create-link")}>+ Create new</button>
            <div className="search-bar-container">
              <img className="search-icon" src={Image6} alt="Search icon" />
              <input
                type="text"
                className="search-bar"
                placeholder="      Search by remarks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="profile">{username ? username.slice(0, 2).toUpperCase() : "US"}</div>
          </div>
        </div>

        <div className="analytics-content">
          <div className="links-table-container">
            <table className="links-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>IP Address</th>
                  <th>User Device</th>
                </tr>
              </thead>
              <tbody>
                {currentLinks.map((link, index) => (
                  <tr key={index}>
                    <td>{link.date || "N/A"}</td>
                    <td>
                      <div className="scrollable-link">
                        <a href={link.originalLink} target="_blank" rel="noopener noreferrer">
                          {link.originalLink}
                        </a>
                      </div>
                    </td>
                    <td>
                      <div className="scrollable-link">
                        <a href={link.shortLink} target="_blank" rel="noopener noreferrer">
                          {link.shortLink}
                        </a>
                      </div>
                    </td>
                    <td>{link.ipAddress || "N/A"}</td>
                    <td>{link.userDevice || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination">
          <img
            className="image5"
            src={Image9}
            alt="Left Arrow"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            style={{
              cursor: currentPage === 1 ? "pointer" : "pointer",
            }}
            disabled={currentPage === 1}
          />
          
          {[...Array(totalPages).keys()].map(pageNumber => (
            <button
              key={pageNumber + 1}
              onClick={() => handlePageChange(pageNumber + 1)}
              className={currentPage === pageNumber + 1 ? "active" : ""}
            >
              {pageNumber + 1}
            </button>
          ))}

          <img
            className="image5"
            src={Image10}
            alt="Right Arrow"
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            style={{
              cursor: currentPage === totalPages ? "pointer" : "pointer",
            }}
            disabled={currentPage === totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
