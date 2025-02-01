import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFileAlt, FaVideo, FaUserAlt } from 'react-icons/fa';

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();
  const [isReportClicked, setIsReportClicked] = useState(false); // State to track the click on report tab

  const isHome = location.pathname === '/' || location.pathname === '/home';
  const isSalesOrPlacement = location.pathname === '/sales' || location.pathname === '/placement';
  const isReportActive = isSalesOrPlacement;
  const isNotificationActive = location.pathname === '/media';
  const isProfileActive = location.pathname === '/underconstruction';

  const isReportDisabled = !isSalesOrPlacement;

  // Handle the click event on the Report tab
  const handleReportClick = () => {
    if (isReportDisabled) {
      setIsReportClicked(true); // Set clicked state to true
      setTimeout(() => {
        setIsReportClicked(false); // Reset back to false after 1 second
      }, 1000);
    }
  };

  return (
    <div className="fixed font-inter  bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around items-center z-50 shadow-lg">
      {/* Home Tab */}
      <div className="text-center">
        <Link
          to="/"
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300 ${isHome ? 'text-green-500' : 'text-white'}`}
        >
          <FaHome size={24} className={isHome ? 'text-green-500' : 'text-white'} />
          <span className={isHome ? 'text-green-500' : 'text-white'}>Home</span>
        </Link>
      </div>

      {/* Report Tab */}
      <div className="relative text-center group">
        <Link
          to={isSalesOrPlacement ? "/report" : "#"}
          onClick={handleReportClick} // Handle the click event
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300
            ${isReportActive ? 'text-green-500' : isReportClicked ? 'text-red-500' : (isReportDisabled ? 'text-white' : 'text-white')}
            ${!isSalesOrPlacement ? 'pointer-events-none' : ''}`}
        >
          <FaFileAlt size={24} className={isReportActive ? 'text-green-500' : isReportClicked ? 'text-red-500' : 'text-white'} />
          <span className={isReportActive ? 'text-green-500' : isReportClicked ? 'text-red-500' : 'text-white'}>
            Report
          </span>
        </Link>
        
        {/* Tooltip (Pop-up on hover) */}
        {isReportDisabled && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Not Clickable
          </div>
        )}
      </div>

      {/* Media Tab */}
      <div className="text-center">
        <Link
          to={isAuthenticated ? "/media" : "/adminlogin"}
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300 ${isNotificationActive ? 'text-green-500' : 'text-white'}`}
        >
          <FaVideo size={24} className={isNotificationActive ? 'text-green-500' : 'text-white'} />
          <span className={isNotificationActive ? 'text-green-500' : 'text-white'}>Media</span>
        </Link>
      </div>

      {/* Profile Tab */}
      <div className="text-center">
        <Link
          to="/underconstruction"
          className={`flex flex-col items-center text-sm px-4 py-2 rounded-full transition-colors duration-300 ${isProfileActive ? 'text-green-500' : 'text-white'}`}
        >
          <FaUserAlt size={24} className={isProfileActive ? 'text-green-500' : 'text-white'} />
          <span className={isProfileActive ? 'text-green-500' : 'text-white'}>Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
