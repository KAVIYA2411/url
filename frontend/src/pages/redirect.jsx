import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RedirectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const shortLinksMapping = {
     
      "abc123": "https://example.com", 
    };

    const originalLink = shortLinksMapping[id];
    if (originalLink) {
      window.location.href = originalLink;
    } else {
      navigate("/not-found");
    }
  }, [id, navigate]);

  return null; 
};

export default RedirectPage;
