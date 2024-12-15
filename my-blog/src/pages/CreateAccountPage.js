import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const createAccount = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        setError("All fields are required");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (password !== confirmPassword) {
        setError("Password and confirm password do not match");
        return;
      }
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container x-padding-container">
      <h1 className="text-center mb-4">Create Account</h1>
      <div className="login-container text-center">
        {error && <p className="error">{error}</p>}
        <input
          type= "email"
          className="my-2"
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
        <input
          className="my-2"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={createAccount} className="my-2">Create Account</button>
        <Link 
          to="/login" 
          state={{ from }}
          className="link">
          Already have an account? Log in here
        </Link>
      </div>     
    </div>
  );
};

export default CreateAccountPage;
