import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateLinkPage = () => {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [enableExpiration, setEnableExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState("");
  
  const navigate = useNavigate();

  const getUserIpAddress = () => {
    return "192.168.0.1"; 
  };

  const getUserDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("mobile")) {
      return "Mobile";
    } else if (userAgent.includes("tablet")) {
      return "Tablet";
    } else {
      return "Laptop";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const ipAddress = getUserIpAddress();
    const userDevice = getUserDevice();

    
    const newLink = {
      date: new Date().toLocaleString(), 
      originalLink: destinationUrl,
      shortLink: `${destinationUrl}/short`, 
      remarks: remarks,
      clicks: 0, 
      status: "Active",
      expirationDate: enableExpiration ? expirationDate : null, 
      ipAddress: ipAddress,  
      userDevice: userDevice, 
      clickDevices: {
        laptop: 0,
        tablet: 0,
        mobile: 0
      }
    };

    
    const existingLinks = JSON.parse(localStorage.getItem("links")) || [];

   
    existingLinks.push(newLink);

    
    localStorage.setItem("links", JSON.stringify(existingLinks));

   
    navigate("/links");
  };

  return (
    <div className="create-link-container">
      <form onSubmit={handleSubmit}>
        <label>Destination URL *</label>
        <input
          type="url"
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          required
        />
        
        <label>Remarks *</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          required
        ></textarea>

     
        <div className="toggle-container">
          <label>Link Expiration</label>
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

        <button type="submit">Create Link</button>
      </form>
    </div>
  );
};

export default CreateLinkPage;
