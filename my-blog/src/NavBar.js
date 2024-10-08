import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";

const NavBar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img className="brandimage" src="/favicon.svg" alt="MyBlog logo" />
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse collapse flex-grow-1 justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link to="/articles">Articles</Link>
            </li>
          </ul>
          <div>
            {user ? (
              <button
                type="button"
                onClick={() => {
                  signOut(getAuth());
                }}
              >
                Log out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
