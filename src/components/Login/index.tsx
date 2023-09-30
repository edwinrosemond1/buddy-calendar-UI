import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import "./component.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  // setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoading }) => {
  const [email, setEmail] = useState(""); // Changed from username to email for Firebase email/password auth.
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate("/");
        console.log("user", userCredential);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      })
      .finally(() => console.log("finally"));
  };

  return (
    <div>
      <div className="login-container">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-email-input"
            label="Email" // Changed from Username to Email.
            type="email" // Changed type to email.
            variant="outlined"
            fullWidth
            className="inputSpacing"
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            className="inputSpacing"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login"
          >
            Login
          </Button>
        </form>
        <Link className="signup" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
