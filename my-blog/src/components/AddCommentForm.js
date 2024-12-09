import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const getDisplayName = (email) => {
    const [username] = email.split("@");
    return username;
  };

  const addComment = async () => {
    setLoading(true);
    try {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = axios.post(
        `/api/articles/${articleName}/comments`,
        {
          postedBy: name,
          text: commentText,
        },
        { headers }
      );
      const updatedArticle = (await response).data;
      console.log("updatedArticle:", updatedArticle);
      onArticleUpdated(updatedArticle);
      setName("");
      setCommentText(""); 
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setLoading(false);
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

  return (
    <div id="add-comment-form" className="w-100">
      <h3 className="mb-3">Add a Comment</h3>
      {user && <p>You are posting as {getDisplayName(user.email)}</p>}
      <textarea
        className="mb-3 w-100"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows="4"
        col="300"
      />
      <button className="mb-3" onClick={addComment}>Add Comment</button>
    </div>
  );
};

export default AddCommentForm;
