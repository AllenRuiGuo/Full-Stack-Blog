import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";

const AddCommentForm = ({ articleName, onArticleUpdated }) => {
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const { user } = useUser();

  const addComment = async () => {
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
    onArticleUpdated(updatedArticle);
    setName("");
    setCommentText("");
  };

  return (
    <div id="add-comment-form" className="w-100">
      <h3 className="mb-3">Add a Comment</h3>
      {user && <p>You are posting as {user.email}</p>}
      <textarea
        className="mb-3"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        rows="4"
        col="300"
      />
      <button className="mb-3" onClick={addComment}>Add Comment</button>
      <hr />
    </div>
  );
};

export default AddCommentForm;
