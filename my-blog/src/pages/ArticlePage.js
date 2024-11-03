import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import { title } from "process";

const ArticlePage = () => {
  const navigate = useNavigate();

  const [articleInfo, setArticleInfo] = useState({
    title: "",
    content: [],
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });

  const [loading, setLoading] = useState(true);
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();

  const { user, isLoading } = useUser();

  useEffect(() => {
    const loadArticleInfo = async () => {
      try {
        const token = user && (await user.getIdToken());
        const headers = token ? { authtoken: token } : {};
        const response = await axios.get(`/api/articles/${articleId}`, {
          headers,
        });
        setArticleInfo(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading article: ", error);
        setLoading(false);
      }
    };

    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user, articleId]);

  const addUpvote = async () => {
    try {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    setArticleInfo(response.data);
    } catch (error) {
      console.error("Error adding upvote: ", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner-border text-primary large-spinner" role="status">         
        </div>
      </div>
    )
  }


  if (!articleInfo.title) {
    return <NotFoundPage />;
  }

  return (
    <div className="container x-padding-container">
      <h1 className="text-center mb-4">{articleInfo.title}</h1>
      <div className="upvotes-section d-flex justify-content-end align-items-center mb-3">
        <p style={{ margin: 16 }}>
          This article has {articleInfo.upvotes} upvote(s)
        </p>
        {user ? (
          <button onClick={addUpvote}>
            {canUpvote ? "Upvote" : "Already Upvoted"}
          </button>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
            }}
          >
            Log in to upvote
          </button>
        )}        
      </div>
      {articleInfo.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfo(updatedArticle)}
        />
      ) : (
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Log in to add a comment
        </button>
      )}
      <CommentsList comments={articleInfo.comments} />
    </div>
  );
};

export default ArticlePage;
