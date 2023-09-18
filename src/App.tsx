import React, { useState, useContext } from "react";
import "./App.css";
import CalendarComponent from "./components/Calendar/index";
import Modal from "react-modal";
import Login from "./components/Login";
import SignUp from "./components/SignUp"; // Remember to import the SignUp component.
import { AppHeader } from "./components/Header";
import CircularProgress from "@mui/material/CircularProgress";
import UserContext from "./contexts/UserContext";

Modal.setAppElement("#root");

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  const { user, loading, setLoading } = useContext(UserContext);

  const handleSignUpSuccess = () => {
    setShowSignUp(false);
  };

  return (
    <>
      <AppHeader setIsLoading={setLoading} />

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : user ? (
        <CalendarComponent />
      ) : showSignUp ? (
        <SignUp
          setShowSignUp={setShowSignUp}
          onSignUpSuccess={handleSignUpSuccess}
        />
      ) : (
        <Login setIsLoading={setLoading} setShowSignUp={setShowSignUp} />
      )}
    </>
  );
}

export default App;
