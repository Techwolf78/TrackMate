import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Home = () => {
  return (
    <div className="bg-[#ffffff]  relative font-inter">
      {/* Blue Container for Top 40% */}
      <div className="bg-gradient-to-b from-[#f9fcf7] to-[#e9f9fb] h-auto flex flex-col items-center justify-center mb-4 rounded-br-3xl rounded-bl-3xl ">
  {/* Company Logo positioned in the top-left corner */}
  <div className="absolute top-4 left-4">
    <img
      src="./blacklogo.png"
      alt="Company Logo"
      className="w-36 h-auto" // Set width to 9rem (w-36) and height auto
    />
  </div>

  {/* Heading Text */}
  <div className="text-3xl md:text-4xl font-bold text-center text-[#316bff] mt-24 sm:mt-20 mb-8 leading-tight">
    Streamline Your Sales and Placement with One Tap
  </div>
</div>



      {/* Main Content Section (Remaining 60% for Sales and Placement) */}
      <div className="flex flex-col items-center justify-center w-full bg-[#ffffff]  space-y-8 px-4">
        {/* Right Column: Tabs Section */}
        <div className="w-full max-w-3xl space-y-6">
          {/* Sales Tab */}
          <Link
            to="/sales" // Set the path for the Sales tab
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white p-6 rounded-xl text-xl font-semibold text-center shadow-xl cursor-pointer hover:scale-105 transform transition-all duration-200 ease-in-out hover:bg-blue-800 flex items-center justify-between"
          >
            <div className="flex flex-col items-start w-full">
              {/* Admin Title above Sales (aligned left) */}
              <div className="text-sm text-white font-extralight">Admin</div>
              <div className="text-lg md:text-4xl text-white font-bold">Sales</div>
            </div>
            <img
              src="./sale.webp"
              alt="Sales Icon"
              className="w-auto h-32 ml-4" // You can adjust size of the image
            />
          </Link>

          {/* Placement Tab */}
          <Link
            to="/placement" // Set the path for the Placement tab
            className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white p-6 rounded-xl text-xl font-semibold text-center shadow-xl cursor-pointer hover:scale-105 transform transition-all duration-200 ease-in-out hover:bg-green-800 flex items-center justify-between"
          >
            <div className="flex flex-col items-start w-full">
              {/* Admin Title above Placement (aligned left) */}
              <div className="text-sm text-white font-extralight">Admin</div>
              <div className="text-lg md:text-4xl text-white font-bold">Placement</div>
            </div>
            <img
              src="./placement.webp"
              alt="Placement Icon"
              className="w-auto h-32 ml-4" // You can adjust size of the image
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
