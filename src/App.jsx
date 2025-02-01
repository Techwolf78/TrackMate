import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebaseConfig"; // Import Firebase auth
import "./App.css";
import Home from "./components/home";
import Sales from "./components/sales";
import Placement from "./components/placement";
import Navbar from './components/navbar';
import Landing from './components/landing';
import Login from "./components/login";
import Forgetpassword from "./components/forgetpassword";
import AdminLogin from "./components/adminLogin";
import Media from "./components/media";
import Spent from "./components/spent";
import UnderConstruction from "./components/underCont";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setIsAuthenticated(true); // If the user is logged in
        setUserEmail(user.email); // Set user email
      } else {
        setIsAuthenticated(false); // If no user is logged in
        setUserEmail(null); // Clear user email
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />

      <div className="main-content"> {/* Apply bottom padding to ensure content doesn't get covered */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/media' element={<Media />} />
          <Route path='/spent' element={<Spent />} />
          <Route path='/underconstruction' element={<UnderConstruction />} />
          {/* Sales and Placement Routes - Protected */}
          <Route
            path="/sales"
            element={isAuthenticated && userEmail === "ajaypawargryphon@gmail.com" ? <Sales /> : <Login />}
          />
          <Route
            path="/placement"
            element={isAuthenticated && userEmail === "mrajaypawar207@gmail.com" ? <Placement /> : <Login />}
          />
          
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<Forgetpassword />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
