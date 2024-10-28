import { useState, useEffect } from "react";
import axios from "axios";

const AboutPage = () => {
  const [content, setContent] = useState({ header: "", paragraphs: [] });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAboutPageContent = async () => {
      try {
        const response = await axios.get("/api/about");
        setContent(response.data); // Update the content state with the fetched data
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error to fetch about page content: ", error);
        setLoading(false);
      }
    };
    
    fetchAboutPageContent();
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-border text-primary large-spinner" role="status">         
        </div>
      </div>
    )
  }

  return (
    <div className="container x-padding-container">
      <h1 className="text-center pb-3">{content.header}</h1>
      {content.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};

export default AboutPage;
