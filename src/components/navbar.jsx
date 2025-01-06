import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Get the current route

  // Determine the active state for the tabs
  const isHome = location.pathname === '/';
  const isSalesOrPlacement = location.pathname === '/sales' || location.pathname === '/placement';
  const isReportActive = isSalesOrPlacement;  // Report is active only if on sales or placement
  const isNotificationActive = location.pathname === '/dashboard';
  const isProfileActive = location.pathname === '/profile';

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around items-center py-2 z-50 shadow-lg">
      {/* Home Tab */}
      <div className="text-center">
        <Link 
          to="/" 
          className={`text-sm hover:text-green-400 ${isHome ? 'text-green-400' : ''}`}
        >
          Home
        </Link>
      </div>

      {/* Report Tab */}
      <div className="text-center">
        <Link 
          to={isSalesOrPlacement ? "/report" : "#"}  // Disable navigation if not on sales or placement
          className={`text-sm hover:text-green-400 ${isReportActive ? 'text-green-400' : 'text-gray-100'} ${!isSalesOrPlacement ? 'pointer-events-none' : ''}`}
        >
          Report
        </Link>
      </div>

      {/* Notification Tab */}
      <div className="text-center">
        <Link 
          to="/dashboard" 
          className={`text-sm hover:text-green-400 ${isNotificationActive ? 'text-green-400' : ''}`}
        >
          Dashboard
        </Link>
      </div>

      {/* Profile Tab */}
      <div className="text-center">
        <Link 
          to="/spent" 
          className={`text-sm hover:text-green-400 ${isProfileActive ? 'text-green-400' : ''}`}
        >
          Spent
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
