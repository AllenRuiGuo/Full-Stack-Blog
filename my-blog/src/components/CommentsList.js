const CommentsList = ({ comments }) => {
  const getDisplayName = (email) => {
    const [username] = email.split("@");
    return username;
  };

  return(
    <>
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div className="comment" key={comment.postedBy + ": " + comment.text}>
          <h5>{getDisplayName(comment.postedBy)}</h5>
          <p>{comment.text}</p>
        </div>
      ))}
    </>
  );
};

export default CommentsList;