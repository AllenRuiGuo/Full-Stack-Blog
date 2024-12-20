import { useState, useEffect } from "react";
import axios from "axios";
import ArticlesList from "../components/ArticlesList";

const ArticlesListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("/api/articles");
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error to fetch articles: ", error);
        setLoading(false);
      }
    };

    fetchArticles();
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
    <div className="container x-padding-container pb-5">
      <h1 className="text-center pb-4">Articles</h1>
      <ArticlesList articles={articles} />
    </div>
  );
};

export default ArticlesListPage;
