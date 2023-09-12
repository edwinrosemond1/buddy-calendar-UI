import React from "react";
import "./App.css";
import CalendarComponent from "./components/Calendar/index";
import Modal from "react-modal";

Modal.setAppElement("#root");

function App() {
  return (
    <div className="App">
      {/* You can add other top-level components or layout components here if needed */}
      <CalendarComponent />
    </div>
  );
}

export default App;
