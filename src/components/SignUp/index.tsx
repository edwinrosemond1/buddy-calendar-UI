import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
// import "./component.css";
import Link from "@mui/material/Link";

interface SignupProps {
  onSignUpSuccess: () => void;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<SignupProps> = ({ onSignUpSuccess, setShowSignUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const URL =
      "http://127.0.0.1:5001/calendar-buddy-bfdf1/us-central1/signup-signup";
    try {
      const response = await axios.post(URL, {
        username,
        password,
      });
      console.log(response);
      const token = response.data.uid;

      if (token) {
        console.log("setting local storage");
        localStorage.setItem("jwt", token);
        onSignUpSuccess();
      } else {
        setError("Error during sign up or server error.");
      }
    } catch (err) {
      setError("Error during sign up or server error.");
    }
  };

  return (
    <div className="login-container">
      {" "}
      {/* Reusing login-container class */}
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          id="signup-username-input"
          label="Username"
          type="text"
          variant="outlined"
          fullWidth
          className="inputSpacing"
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          id="signup-password-input"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          className="inputSpacing"
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          id="signup-confirm-password-input"
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          className="inputSpacing"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="login" // Reusing the login class for the button
        >
          Sign Up
        </Button>
      </form>
      <Link
        component="button"
        className="signup"
        variant="h6"
        onClick={() => {
          setShowSignUp(false);
        }}
      >
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Signup;
