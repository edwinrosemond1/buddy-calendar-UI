import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import Link from "@mui/material/Link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

interface SignupProps {
  onSignUpSuccess: () => void;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<SignupProps> = ({ setShowSignUp }) => {
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
    try {
      createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
          // Signed in
          console.log("user", userCredential);
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        })
        .finally(() => console.log("finally"));
    } catch (err) {
      console.log("error");
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
          label="Email"
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
