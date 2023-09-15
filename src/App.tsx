import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import CalendarComponent from "./components/Calendar/index";
import Modal from "react-modal";
import Login from "./components/Login";
import SignUp from "./components/SignUp"; // Remember to import the SignUp component.
import { AppHeader } from "./components/Header";

Modal.setAppElement("#root");

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      // Optionally: validate the token with the backend to ensure it's still valid.
      setIsAuthenticated(true);
    }
  }, []);

  // useEffect(() => {
  //   // Check if user is authenticated on initial load
  //   axios.get("/is-authenticated").then((response) => {
  //     if (response.data.isAuthenticated) {
  //       setIsAuthenticated(true);
  //     }
  //   });
  // }, []);

  const handleSignUpSuccess = () => {
    setShowSignUp(false); // Hide the SignUp component
    // You can add any other logic here if needed after a successful sign-up.
  };

  return (
    <>
      <AppHeader setIsAuthenticated={setIsAuthenticated} />

      {isAuthenticated ? (
        <CalendarComponent />
      ) : showSignUp ? (
        <SignUp
          setShowSignUp={setShowSignUp}
          onSignUpSuccess={handleSignUpSuccess}
        />
      ) : (
        <Login
          setShowSignUp={setShowSignUp}
          onLoginSuccess={() => setIsAuthenticated(true)}
        />
      )}
    </>
  );
}

export default App;
