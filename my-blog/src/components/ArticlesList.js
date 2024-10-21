import { Link } from "react-router-dom";

const ArticlesList = ({ articles }) => {
  return (
    <div className="row">
      {articles.map((article) => (
        <div key={article.name} className="col-12 col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <Link
                key={article.name}
                className="article-list-item"
                to={`/articles/${article.name}`}
              >
                <h3 className="card-title mb-3">{article.title}</h3>
              </Link>
              <p className="card-text">{article.content[0].substring(0, 150)}...</p>
              <Link
                className="text-primary text-decoration-none"
                to={`/articles/${article.name}`}
              >
                Read more
              </Link>
            </div>
          </div>
        </div>       
      ))}
    </div>
  );
};

export default ArticlesList;