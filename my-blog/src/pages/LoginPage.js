import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { async } from "@firebase/util";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const longIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate("/articles");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container x-padding-container">
      <h1 className="text-center mb-4">Log In</h1>
      <div className="login-container text-center">
          {error && <p className="error">{error}</p>}
          <input
            className="my-2"
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="my-2"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={longIn} className="my-2 w-100">Log In</button>
          <Link to="/create-account" className="link">
            Don't have an account? Create one
          </Link>
      </div>    
    </div>
  );
};

export default LoginPage;
