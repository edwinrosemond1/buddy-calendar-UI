import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../firebase-config";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  // onSignUpSuccess: () => void;
  // setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Signup: React.FC<SignupProps> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      createUserWithEmailAndPassword(auth, username, password)
        .then(async (userCredential) => {
          const color = generateRandomColor();
          const userRef = doc(firestore, "users", userCredential.user.uid); // assuming your collection is named 'users'
          await setDoc(userRef, { color });
          navigate("/");
          // Signed in
        })
        .catch((error) => {
          const errorMessage = error.message;
          setError(errorMessage);
        })
        .finally(() => console.log("finally"));
    } catch (err) {
      console.error("error");
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
      <Link className="signup" to="/login">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Signup;
