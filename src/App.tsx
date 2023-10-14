import React, { useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Modal from "react-modal";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { AppHeader } from "./components/Header";
import CircularProgress from "@mui/material/CircularProgress";
import UserContext from "./contexts/UserContext";
import { HomePage } from "./components/GroupPage";
import CalendarComponent from "./components/Calendar/index";
import { ViewRequests } from "./components/Requests";

Modal.setAppElement("#root");

function App() {
  const { user, loading, setLoading } = useContext(UserContext);

  return (
    <Router>
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
      ) : (
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate replace to="/login" />}
          />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/login" element={<Login setIsLoading={setLoading} />} />

          <Route path="/calendar" element={<CalendarComponent />} />
          <Route path="/requests" element={<ViewRequests />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
