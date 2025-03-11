import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sun from "../assets/sun.png";
import cuv_Image from "../assets/cuv.png";
import Image6 from "../assets/Frame_(1).png";
import copy from "../assets/copy.png";
import tik from "../assets/Vector_(3).png";
import Image1 from "../assets/Icons_(1).svg";
import Image2 from "../assets/Icons_(2).svg";
import Image3 from "../assets/Icons_(3).svg";
import Image4 from "../assets/Icons.svg";
import Image9 from "../assets/Vector_(4).png";
import Image10 from "../assets/Vector_(5).png";
import edi from "../assets/Icons_(1).png";
import del from "../assets/Dropdown.png";


const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState(""); 
  const [copied, setCopied] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [enableExpiration, setEnableExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false); 

  
  const [currentPage, setCurrentPage] = useState(1);
  const [linksPerPage] = useState(5); 

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const storedLinks = JSON.parse(localStorage.getItem("links")) || [];
    setLinks(storedLinks);
    setFilteredLinks(storedLinks);
    updateGreeting();
    const interval = setInterval(updateGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredLinks(
      links.filter((link) =>
        link.remarks.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, links]);

  
  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = filteredLinks.slice(indexOfFirstLink, indexOfLastLink);

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

  const handleCopy = (index) => {
    const globalIndex = (currentPage - 1) * linksPerPage + index; 
    const updatedLinks = [...links]; 
    
    updatedLinks[globalIndex].clicks = (updatedLinks[globalIndex].clicks || 0) + 1;
    setLinks(updatedLinks);  
    setFilteredLinks(updatedLinks);  

    localStorage.setItem("links", JSON.stringify(updatedLinks));
  
    navigator.clipboard.writeText(updatedLinks[globalIndex].shortLink);
  
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setDestinationUrl(link.originalLink);
    setRemarks(link.remarks);
    setExpirationDate(link.expirationDate || "");
    setEnableExpiration(!!link.expirationDate);
    setShowEditPopup(true);
  };

  const handleDelete = (index) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this link?");
    if (isConfirmed) {
      const updatedLinks = links.filter((_, i) => i !== index);
      setLinks(updatedLinks);
      setFilteredLinks(updatedLinks);
      localStorage.setItem("links", JSON.stringify(updatedLinks));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const shortId = Math.random().toString(36).substring(2, 8); 
    const shortLink = `${window.location.origin}/${shortId}`;
  
    const newLink = {
      date: new Date().toLocaleString(),
      originalLink: destinationUrl,
      shortLink: shortLink, 
      remarks: remarks,
      clicks: 0,
      status: "Active",
      expirationDate: enableExpiration ? expirationDate : null,
    };
  
    const existingLinks = JSON.parse(localStorage.getItem("links")) || [];
  
    if (editingLink) {
      const updatedLinks = existingLinks.map(link =>
        link.originalLink === editingLink.originalLink ? newLink : link
      );
      localStorage.setItem("links", JSON.stringify(updatedLinks));
      setLinks(updatedLinks);
      setFilteredLinks(updatedLinks);
    } else {
      existingLinks.push(newLink);
      localStorage.setItem("links", JSON.stringify(existingLinks));
      setLinks(existingLinks);
      setFilteredLinks(existingLinks);
    }
  
    setEditingLink(null);
    setDestinationUrl("");
    setRemarks("");
    setExpirationDate("");
    setEnableExpiration(false);
    setShowEditPopup(false); 
  };
  
  // Pagination controls
  const totalPages = Math.ceil(filteredLinks.length / linksPerPage);
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
            <button className="sidebar-link-button active" onClick={() => navigate("/links")}>
              <img className="image1" src={Image1} alt="Links" />Links
            </button>
          </li>
          <li>
            <button className="sidebar-link-button" onClick={() => navigate("/analytics")}>
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

        {showEditPopup && (
          <div className="popup-background" onClick={() => setShowEditPopup(false)}>
            <div className="popup-form-container" onClick={(e) => e.stopPropagation()}>
              <span className="close-btn" onClick={() => setShowEditPopup(false)}>&times;</span>
              <form onSubmit={handleSubmit}>
                <label>Destination URL *</label><br></br>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  required
                /><br></br>
                
                <label>Remarks *</label><br></br>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                ></textarea><br></br>

                <div className="toggle-container">
                  <label>Link Expiration</label><br></br>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={enableExpiration}
                      onChange={() => setEnableExpiration(!enableExpiration)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {enableExpiration && (
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                )}
<br></br>
                <button type="submit" className="submit-btn">save</button><br></br>
                <button type="button" className="cancel-btn" onClick={() => setShowEditPopup(false)}>Cancel</button>
              </form>
            </div>
          </div>
        )}

        <div className="links-table-container">
          <table className="links-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Original Link</th>
                <th>Short Link</th>
                <th>Clicks</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Action</th>
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
                    <div className="scrollable-link">{link.shortLink}</div>
                    <img
                      className="copy-icon"
                      src={copy}
                      alt="Copy"
                      onClick={() => handleCopy(index)}
                    />
                  </td>
                  <td>{link.clicks || 0}</td>
                  <td>{link.remarks}</td>
                  <td>{link.expirationDate ? "Inactive" : "Active"}</td>
                  <td>
                    <button onClick={() => handleEdit(link)} className="edit-link-button">
                    <img className="edit" src={edi} alt="Search icon" />
                    </button>
                    <button onClick={() => handleDelete(index)}><img className="del" src={del} alt="Search icon" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <img
            className="image5"
            src={Image9}
            alt="Left Arrow"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
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
            disabled={currentPage === totalPages} 
          />
        </div>
        {copied && <div className="copied-message"><img className="tik" src={tik} alt="tik" /> Link Copied!</div>}
      </div>
    </div>
  );
};

export default LinksPage;
