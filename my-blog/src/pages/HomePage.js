import { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [content, setContent] = useState({ header: "", paragraphs: [], imageUrl: "" }); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageContent = async () => {
      try {
        const response = await axios.get("/api/homepage");
        setContent(response.data); // Update the content state with the feteched data
        setLoading(false); // Stop the loading state
      } catch (error) {
        console.error("Error to fetch homepage content: ", error);
        setLoading(false); 
      }
    };

    fetchHomepageContent();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching the data
  }

  return (
    <div className="container x-padding-container">
      <h1 className="text-center pb-2">{content.header}</h1>
      {content.imageUrl && <img src={content.imageUrl} alt="Homepage thumbnail image" className="homepage-thumbnail-image py-3"/>}
      {content.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
};

export default HomePage;
