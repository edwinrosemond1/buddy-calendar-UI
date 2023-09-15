import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import Link from "@mui/material/Link";
import axios from "axios"; // Assuming you have axios installed.
import "./component.css";

interface LoginProps {
  onLoginSuccess: () => void;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, setShowSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Error state for handling invalid credentials or server issues.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("YOUR_BACKEND_ENDPOINT_HERE/login", {
        username,
        password,
      });
      const { token } = response.data;

      if (token) {
        localStorage.setItem("jwt", token);
        onLoginSuccess(); // If login was successful, call the onLoginSuccess function.
      } else {
        setError("Invalid credentials or server error.");
      }
    } catch (err) {
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div>
      <div className="login-container">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <TextField
            id="outlined-username-input"
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            className="inputSpacing"
            onChange={(e) => setUsername(e.target.value)}
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
        <Link
          component="button"
          className="signup"
          variant="h6"
          onClick={() => {
            setShowSignUp(true);
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
