import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sun from "../assets/sun.png";
import cuv_Image from "../assets/cuv.png";
import Image1 from "../assets/Icons_(1).svg";
import Image2 from "../assets/Icons_(2).svg";
import Image3 from "../assets/Icons_(3).svg";
import Image4 from "../assets/Icons.svg";
import Image6 from "../assets/Frame_(1).png"; 

const API_BASE_URL = typeof process !== "undefined" && process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : "https://backend-url-shorten-2.onrender.com";

const SettingsPage = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
 
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username || "Guest");
      setEmail(parsedUser.email || "");
      setMobile(parsedUser.mobile || "");
    } else {
      navigate("/login");
    }

    updateGreeting();
    const interval = setInterval(updateGreeting, 1000); 
    return () => clearInterval(interval); 
  }, []);

  const updateGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) setGreeting("Good Morning");
    else if (hours < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const day = now.toLocaleDateString("en-US", { weekday: "short" });
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    setCurrentTime(`${day}, ${date} | ${timeString}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    
    if (e.target.value) {
      navigate("/links"); 
    }
  };

  const handleSaveChanges = async () => {
    const updatedUser = { username, email, mobile };

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        alert("You need to log in again.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const result = await response.text();
        throw new Error(result || "Failed to update user data");
      }

      const result = await response.json();
      alert("User data updated successfully!");
      sessionStorage.setItem("user", JSON.stringify(updatedUser)); 
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("There was an error saving the changes.");
    }
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
            <button className="sidebar-link-button active" onClick={() => navigate("/settings")}>
              <img className="image1" src={Image3} alt="Settings" />Settings
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        <div className="navbar">
          <div className="greeting">
            <h3>
              <img className="sun" src={sun} alt="Sun icon" /> {greeting}, {username || "Guest"}
            </h3>
            <p className="time">{currentTime}</p>
          </div>

          <div className="navbar-actions">
            <button className="create-link-button" onClick={() => navigate("/create-link")}>+ Create new</button>
            <div className="search-bar-container">
              <img className="search-icon" src={Image6} alt="Search icon" />
              <input
                type="text"
                className="search-bar"
                placeholder="     Search by remarks"
                value={searchTerm}
                onChange={handleSearchChange} // Update this handler
              />
            </div>
            <div className="profile">{username ? username.slice(0, 2).toUpperCase() : "US"}</div>
          </div>
        </div>

        <div className="settings-content">
          <div className="settings-form">
            <table>
              <tbody>
                <tr>
                  <td><label>Name</label></td>
                  <td><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></td>
                </tr>
                <tr>
                  <td><label>Email id</label></td>
                  <td><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></td>
                </tr>
                <tr>
                  <td><label>Mobile no.</label></td>
                  <td><input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} /></td>
                </tr>
              </tbody>
            </table>

            <div className="settings-actions">
              <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
              <button className="delete-button" onClick={() => navigate("/login")}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
