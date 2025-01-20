import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/home"; // Import Home component
import Sales from "./components/sales"; // Import Sales component
import Placement from "./components/placement"; // Import Placement component
import Navbar from './components/navbar'; // Import Navbar component
import Media from "./components/media";
import Spent from './components/spent';
import Landing from './components/landing'; // Import Landing component
import Login from "./components/login";
import Forgetpassword from "./components/forgetpassword";

const App = () => {
  return (
    <Router>
      {/* Content Routes */}
      <Routes>
        <Route path="/" element={<Landing />} /> {/* Landing Page */}
        <Route path="/home" element={<Home />} /> {/* Home page */}
        <Route path="/sales" element={<Sales />} /> {/* Sales page */}
        <Route path="/placement" element={<Placement />} /> {/* Placement page */}
        <Route path="/report" element={<div>Report Page</div>} /> {/* Report Page */}
        <Route path="/media" element={<Media />} /> {/* Notification Page */}
        <Route path="/spent" element={<Spent />} /> {/* Profile Page */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/forgetpassword" element={<Forgetpassword />} /> {/* Forget Password Page */}
      </Routes>

      {/* Always Visible Navbar */}
      <Navbar />
    </Router>
  );
};

export default App;
