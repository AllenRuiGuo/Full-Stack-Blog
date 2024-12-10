import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
import useUser from "../hooks/useUser";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
  const [showModal, setShowModal] = useState(false);
  const { canUpvote } = articleInfo;
  const { articleId } = useParams();

  const { user, isLoading } = useUser();

  useEffect(() => {
    const loadArticleInfo = async () => {
      try {
        setLoading(true);
        const token = user && (await user.getIdToken());
        const headers = token ? { authtoken: token } : {};
        const response = await axios.get(`/api/articles/${articleId}`, {
          headers,
        });
        setArticleInfo(response.data);
      } catch (error) {
        console.error("Error loading article: ", error);
        setArticleInfo({});
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user, articleId]);

  const addUpvote = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    // console.log(response.data);
    setArticleInfo(response.data);
    // console.log(articleInfo);
    } catch (error) {
      console.error("Error adding upvote: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommentClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      setShowModal(true);
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
      <div className="pt-3 pb-0">
        {articleInfo.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="upvotes-section d-flex justify-content-start align-items-center">
        {/*
        <p className="my-3 me-3">
          This article has {articleInfo.upvotes} upvote(s)
        </p>
        {user ? (
          <button onClick={addUpvote} disabled={!canUpvote}>
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
        */}
        <p className="my-0 me-3">
          {user ? (
            <button
              className="heart-button"
              onClick={addUpvote}
              disabled={!canUpvote || loading}
              aria-label="Upvote"
            >
              {canUpvote ? (
                <i className="bi bi-heart text-dark"></i>
              ) : (
                <i className="bi bi-heart-fill text-danger"></i>
              )}
            </button>
          ) : (
            <button
              className="heart-button"
              onClick={() => {
                navigate("/login");
              }}
              aria-label="Log in to upvote"
            >
              <i className="bi bi-heart text-dark"></i>
            </button>
          )}
          <span className="">{articleInfo.upvotes}</span>
        </p>
      </div>
      <hr />
      <div className="comments-section mt-4">
        <button className="btn btn-primary mb-3" onClick={handleAddCommentClick}>
          Add a comment
        </button>
      </div> 
      <CommentsList comments={articleInfo.comments} />   
      {showModal && (
        <div 
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Add a comment</h3>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <AddCommentForm
                  articleName={articleId}
                  onArticleUpdated={(updatedArticle) => {
                  setArticleInfo(updatedArticle);
                  setShowModal(false); // Close modal after submitting
                  }}
                />
              </div>
            </div>                    
          </div>
        </div>
      ) }
    </div>
  );
};

export default ArticlePage;
