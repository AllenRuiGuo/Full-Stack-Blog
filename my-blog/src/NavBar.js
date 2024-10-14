import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useUser from "./hooks/useUser";
import { useState } from "react";

const NavBar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

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
          aria-expanded={!isNavCollapsed ? true : false} 
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`navbar-collapse collapse flex-grow-1 justify-content-end ${!isNavCollapsed ? "show": ""}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item me-3">
              <Link to="/" onClick={() => setIsNavCollapsed(true)}>Home</Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/about" onClick={() => setIsNavCollapsed(true)}>About</Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/articles" onClick={() => setIsNavCollapsed(true)}>Articles</Link>
            </li>
          </ul>
          <div>
            {user ? (
              <button
                type="button"
                className="loginButton"
                onClick={() => {
                  signOut(getAuth());
                  setIsNavCollapsed(true);
                }}
              >
                Log out
              </button>
            ) : (
              <button
                type="button"
                className="loginButton"
                onClick={() => {
                  navigate("/login");
                  setIsNavCollapsed(true);
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
