import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import sun from "../assets/sun.png";
import cuv_Image from "../assets/cuv.png";
import Image1 from "../assets/Icons_(1).svg";
import Image2 from "../assets/Icons_(2).svg";
import Image3 from "../assets/Icons_(3).svg";
import Image4 from "../assets/Icons.svg";
import Image6 from "../assets/Frame_(1).png";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState({});
  const [deviceClicks, setDeviceClicks] = useState({ Mobile: 0, Desktop: 0, Tablet: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.username);
    }

    const queryParams = new URLSearchParams(location.search);
    setSearchTerm(queryParams.get("search") || "");
  }, [location]);

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good morning");
      else if (hours < 18) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      const day = now.toLocaleDateString("en-US", { weekday: "short" });
      const month = now.toLocaleDateString("en-US", { month: "short" });
      const date = now.getDate();
      setCurrentDate(`${day}, ${month} ${date}`);

      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateGreetingAndTime();
    const interval = setInterval(updateGreetingAndTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateClicks = () => {
      const storedLinks = JSON.parse(localStorage.getItem("links")) || [];

      const dateClicks = {};
      const deviceData = { Mobile: 0, Desktop: 0, Tablet: 0 };

      storedLinks.forEach((link) => {
        if (link.date) {
          const formattedDate = link.date.split(" ")[0];
          dateClicks[formattedDate] = (dateClicks[formattedDate] || 0) + (link.clicks || 0);
        }

        if (link.device === "Mobile") deviceData.Mobile += link.clicks || 0;
        if (link.device === "Desktop") deviceData.Desktop += link.clicks || 0;
        if (link.device === "Tablet") deviceData.Tablet += link.clicks || 0;
      });

      setTotalClicks(Object.values(dateClicks).reduce((sum, val) => sum + val, 0));

      
      deviceData.Desktop += totalClicks;

      setDateWiseClicks(dateClicks);
      setDeviceClicks(deviceData);
    };

    calculateClicks();
  }, [totalClicks]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/links?search=${searchTerm}`);
  };

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
            <button className="sidebar-link-button" onClick={() => navigate("/analytics")}>
              <img className="image1" src={Image2} alt="Analytics" />Analytics
            </button>
          </li>
          <li>
            <hr />
            <button className="sidebar-link-button" onClick={() => navigate("/settings")}>
              <img className="image1" src={Image3} alt="Settings" />Settings
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="greeting">
            <h3>
              <img className="sun" src={sun} alt="sun icon" />
              {greeting}, {username || "User"}
            </h3>
            <p className="date-time">{currentDate} | {currentTime}</p>
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
                onChange={handleSearchSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              />
            </div>
            <div className="profile">
              {username ? username.slice(0, 2).toUpperCase() : "US"}
            </div>
          </div>
        </div>

     
        <div className="dashboard-content">
          <h2>Total Clicks <span className="clicks-number">{totalClicks}</span></h2>

          <div className="clicks-container">
           
            <div className="click-box">
              <h3 className="click-title">Date-wise Clicks</h3>
              <div className="clicks-list">
                {Object.keys(dateWiseClicks).map(date => (
                  <div key={date} className="click-row">
                    <span className="click-date">{date}</span>
                    <span className="click-count">{dateWiseClicks[date]}</span>
                  </div>
                ))}
              </div>
            </div>

            <span className="click-box1">
              <h3 className="click-title">Click Devices</h3>
              <div className="clicks-list">
                <div className="click-row">
                  <span className="click-device">Mobile: &nbsp;    </span>
                  <span className="click-count">{deviceClicks.Mobile}</span>
                </div>
                <div className="click-row">
                  <span className="click-device">Tablet: &nbsp;  &nbsp;   </span>
                  <span className="click-count">{deviceClicks.Tablet}</span>
                </div>
                <div className="click-row">
                  <span className="click-device">Laptop:   &nbsp; </span>
                  <span className="click-count">{deviceClicks.Desktop}</span>
                </div>
              </div>
            </span>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Dashboard;

