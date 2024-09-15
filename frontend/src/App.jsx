import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import FormAndList from "./components/FormAndList";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<FormAndList />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
