import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import db from "../firebaseConfig";
import { FaFileImage, FaTimes, FaSyncAlt } from 'react-icons/fa'; 
import { FaCloud } from 'react-icons/fa';

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the list of files from Firebase
  const fetchFiles = async () => {
    try {
      const filesRef = ref(db, "uploaded_files");
      const snapshot = await get(filesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const fileArray = Object.values(data);
        setFiles(fileArray);
        setFilteredFiles(fileArray);
      } else {
        console.log("No files found.");
        setFiles([]);
        setFilteredFiles([]);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format the date to Month Day, Year
  const formatToMonthDayYear = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return d.toLocaleDateString("en-US", options);
  };

  // Filter files based on search query
  const filterFiles = () => {
    let filtered = files;

    // Filter by search query (case insensitive)
    if (searchQuery) {
      filtered = filtered.filter((file) =>
        file.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterFiles();
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleCloseSidebar = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // Icon handling for image files
  const getFileTypeIcon = (fileFormat) => {
    let icon = <FaFileImage />;
    let bgColor = "bg-cyan-400"; // Cyan for images

    return (
      <div className={`p-2 rounded-full ${bgColor} inline-block`}>
        {icon}
      </div>
    );
  };

  // Sort files by date (latest first) for the Recents section
  const sortedFiles = [...files].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilteredFiles(files); // Reset to show all files
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen mb-10 relative font-inter ">
      <h1 className="text-4xl font-bold text-left mb-6 text-blue-600 flex items-center">
        <FaCloud className="mr-2 text-blue-600" size={30} />
        Storage
      </h1>

      {/* Recents Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-left text-gray-700 mb-6">Recent</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {sortedFiles.slice(0, 4).map((file, index) => {
            // Light pastel color palette for cards
            const pastelColors = ['bg-indigo-50', 'bg-blue-50', 'bg-green-50', 'bg-pink-50'];
            const colorClass = pastelColors[index % pastelColors.length]; // Simple cycle through the colors

            return (
              <div
                key={index}
                className={`${colorClass} p-3 shadow-md rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg`}
                onClick={() => handleFileClick(file)}
              >
                <div className="relative w-full h-32 mb-2 overflow-hidden rounded-lg">
                  <img
                    src={file.secure_url}
                    alt={file.original_filename}
                    className="w-full h-full object-cover rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
                  />
                </div>
                <p className="text-base font-light text-center text-gray-700 truncate">{file.original_filename}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex items-center mb-6">
        <label htmlFor="search" className="text-lg font-semibold text-gray-700 mr-2">Search:</label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 transition duration-200"
          placeholder="Search by file name"
        />
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={handleResetFilters}
        className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-2 md:px-3 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out focus:outline-none hover:from-blue-400 hover:to-indigo-500 my-1 md:my-3 sm:py-1.5 sm:px-2 sm:text-sm"
      >
        <FaSyncAlt className="mr-1 md:mr-3 text-xs transform transition-all duration-300 md:text-lg" />
        <span className="font-semibold text-xs md:text-lg">Reset Filters</span>
      </button>

      {isLoading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-600">{error}</div>}

      {filteredFiles.length === 0 && !isLoading && !error && (
        <div className="text-center text-gray-600">No files found.</div>
      )}

      {/* Table Section */}
      <div className="transition-all duration-300 ease-in-out">
        <div className="hidden sm:block">
          <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="py-3 px-4 border-b text-left">File Name</th>
                <th className="py-3 px-4 border-b text-left">Size</th>
                <th className="py-3 px-4 border-b text-left">Dimensions</th>
                <th className="py-3 px-4 border-b text-left">Uploaded At</th>
                <th className="py-3 px-4 border-b text-left">Format</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-200 hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer"
                  onClick={() => handleFileClick(file)}
                >
                  <td className="py-3 px-4 flex items-center">
                    {getFileTypeIcon(file.format)}
                    <span className="ml-2">{file.original_filename}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatFileSize(file.size)}</td>
                  <td className="py-3 px-4 text-gray-600">{file.width}x{file.height}</td>
                  <td className="py-3 px-4 text-gray-600">{formatToMonthDayYear(file.created_at)}</td>
                  <td className="py-3 px-4 text-gray-600">{file.format}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.secure_url, file.original_filename);
                      }}
                      className="text-blue-500 hover:underline focus:outline-none"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-friendly 2-Column Layout */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-4">
          {filteredFiles.map((file, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
            >
              <div className="flex flex-col items-center">
                <div className="w-full h-32 mb-3 overflow-hidden rounded-lg">
                  <img
                    src={file.secure_url}
                    alt={file.original_filename}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <p className="text-sm font-semibold text-center text-gray-800">{file.original_filename}</p>
                <p className="text-xs text-center text-gray-600">{formatFileSize(file.size)}</p>
                <p className="text-xs text-center text-gray-600">{file.width}x{file.height}</p>
                <p className="text-xs text-center text-gray-600">{formatToMonthDayYear(file.created_at)}</p>
                <p className="text-xs text-center text-gray-600">{file.format}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file.secure_url, file.original_filename);
                  }}
                  className="mt-3 w-full bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition duration-150"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedFile && (
  <div className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-gradient-to-b from-[#f3f4f6] to-white shadow-xl z-50 p-6 transform transition-all duration-300 ease-in-out rounded-lg overflow-hidden">
    <button 
      onClick={handleCloseSidebar} 
      className="absolute top-5 right-5 text-2xl text-gray-500 hover:text-blue-600 transition-all duration-200 ease-in-out"
    >
      <FaTimes />
    </button>
    <h2 className="text-3xl font-bold text-gray-800 mb-6">{selectedFile.original_filename}</h2>
    <div className="relative w-full h-56 mb-6 rounded-lg overflow-hidden shadow-lg">
      <img
        src={selectedFile.secure_url}
        alt={selectedFile.original_filename}
        className="w-full h-full object-cover transform scale-100 hover:scale-105 transition-all duration-300 ease-in-out"
      />
    </div>
    <div className="space-y-4 text-gray-700 text-lg">
      <p><strong className="text-gray-900">Size:</strong> {formatFileSize(selectedFile.size)}</p>
      <p><strong className="text-gray-900">Dimensions:</strong> {selectedFile.width}x{selectedFile.height}</p>
      <p><strong className="text-gray-900">Uploaded At:</strong> {formatToMonthDayYear(selectedFile.created_at)}</p>
      <p><strong className="text-gray-900">Format:</strong> {selectedFile.format}</p>
    </div>
    <button
      onClick={() => handleDownload(selectedFile.secure_url, selectedFile.original_filename)}
      className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
    >
      Download
    </button>
  </div>
)}

    </div>
  );
}

export default Dashboard;
