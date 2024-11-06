const CommentsList = ({ comments }) => {
  const getDisplayName = (email) => {
    const [username] = email.split("@");
    return username;
  };

  return(
    <>
      <h2 className="mb-4">Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div className="comment" key={comment.postedBy + ": " + comment.text}>
            <h6>{getDisplayName(comment.postedBy)}</h6>
            <p>{comment.text}</p>
          </div>
        ))
      ) : (
        <h5 className="text-center">There is no comment yet.</h5>
      )}
    </>
  );
};

export default CommentsList;