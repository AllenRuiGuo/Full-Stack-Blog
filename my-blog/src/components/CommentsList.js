const CommentsList = ({ comments }) => {
  const getDisplayName = (email) => {
    const [username] = email.split("@");
    return username;
  };

  return(
    <>
      <h2 className="mb-3">Comments</h2>
      {comments.map((comment) => (
        <div className="comment" key={comment.postedBy + ": " + comment.text}>
          <h6>{getDisplayName(comment.postedBy)}</h6>
          <p>{comment.text}</p>
        </div>
      ))}
    </>
  );
};

export default CommentsList;