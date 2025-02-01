import React, { useEffect, useState, useRef } from "react";
import { getDatabase, ref, get, remove } from "firebase/database";
import { db } from "../firebaseConfig"; // Use named import instead of default
import debounce from "lodash.debounce";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaFileImage,  FaSyncAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileDetailSidebar from "./FileDetailSidebar"; // Import the new component
import StorageHeader from "./StorageHeader"; // Import the new StorageHeader component

function Media() {
  const [files, setFiles] = useState([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [page, setPage] = useState(1); // Track the current page
  const [perPage] = useState(15); // Number of items to load at once
// Replace existing hasMoreFiles calculation
const hasMoreFiles = filteredFiles.length < files.length;
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

 // Modified fetchFiles function (load all data once)
const fetchFiles = async () => {
  try {
    setIsLoading(true);
    const filesRef = ref(db, "uploaded_files");
    const snapshot = await get(filesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const fileArray = Object.values(data).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFiles(fileArray);
      setFilteredFiles(fileArray.slice(0, perPage * page));
    } else {
      setFiles([]);
      setFilteredFiles([]);
    }
  } catch (err) {
    setError("Failed to load files.");
  } finally {
    setIsLoading(false);
  }
};

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("User signed out");
      toast.success("Logged out successfully");

      // Redirect to the login page after logout
      navigate("/adminlogin"); // Replace "/login" with your login route if it's different
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

// Updated handleLoadMore
const handleLoadMore = () => {
  setPage(prev => {
    const newPage = prev + 1;
    setFilteredFiles(files.slice(0, perPage * newPage));
    return newPage;
  });
};



  useEffect(() => {
    fetchFiles(page); // Fetch the files for the new page when the page changes
  }, [page]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      // Extract only the part before @ symbol
      const emailPrefix = storedEmail.split("@")[0]; // Split the email and take the first part
      setEmail(emailPrefix); // Set the state with the email prefix
    } else {
      console.log("No email found in localStorage");
    }
  }, []);

  const formatToMonthDayYear = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return d.toLocaleDateString("en-US", options);
  };

// Updated filter function
const filterFiles = (query) => {
  const filtered = files.filter(file => 
    file.original_filename.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredFiles(filtered.slice(0, perPage * page));
};

// Update useEffect for search
useEffect(() => {
  filterFiles(searchQuery);
}, [searchQuery]);

  const handleSearchChange = debounce((e) => {
    setSearchQuery(e.target.value);
    filterFiles(e.target.value);
  }, 500); // Adjust debounce delay as needed

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
    console.log("File clicked:", file); // Log the file to check if it's correct
    setSelectedFile(file);
  };
  useEffect(() => {
    console.log("selectedFile updated:", selectedFile); // Log to track selectedFile state
  }, [selectedFile]);
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
  const getFileTypeIcon = (fileFormat) => {
    let icon = <FaFileImage />;
    let bgColor = "bg-cyan-400";
    return (
      <div className={`p-2 rounded-full ${bgColor} inline-block`}>{icon}</div>
    );
  };
  const sortedFiles = [...files].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
// Fixed reset function
const handleResetFilters = () => {
  setSearchQuery("");
  setPage(1);
  setFilteredFiles(files.slice(0, perPage));
};
// Update useEffect for initial load
useEffect(() => {
  fetchFiles();
}, []); // Empty dependency array
  const handleDelete = async (publicId) => {
    try {
      console.log("Deleting file with public_id: ", publicId); // Check the ID
      const fileRef = ref(db, `uploaded_files/${publicId}`);
      await remove(fileRef);
      setFiles(files.filter((file) => file.public_id !== publicId));
      setFilteredFiles(
        filteredFiles.filter((file) => file.public_id !== publicId)
      );
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting the file:", error);
      toast.error("Error deleting the file. Please try again later.");
    }
  };
  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true); // Show the confirmation modal
  };
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      // Use public_id for deletion
      await handleDelete(fileToDelete.public_id); // Pass public_id
      setIsDeleteModalOpen(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error deleting the file:", error);
      alert("Error deleting the file. Please try again later.");
    }
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setFileToDelete(null); // Reset fileToDelete state
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen mb-10 relative font-inter">
  <StorageHeader email={email} /> {/* Use the new StorageHeader component */}
      {/* Recents Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-left text-gray-700 mb-6">
          Recent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {sortedFiles.slice(0, 4).map((file, index) => {
            // Light pastel color palette for cards
            const pastelColors = [
              "bg-indigo-50",
              "bg-blue-50",
              "bg-green-50",
              "bg-pink-50",
            ];
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
                    loading="lazy"
                  />
                </div>
                <p className="text-base font-light text-center text-gray-700 truncate">
                  {file.original_filename}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Filters Section */}
      <div className="flex items-center mb-6">
        <label
          htmlFor="search"
          className="text-lg font-semibold text-gray-700 mr-2"
        >
          Search:
        </label>
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
      {isLoading && (
        <div className="flex justify-center items-center space-x-4 p-6">
          <div className="animate-spin border-t-4 border-blue-500 w-12 h-12 border-solid rounded-full"></div>
          <span className="text-lg text-gray-700 font-semibold">
            Loading...
          </span>
        </div>
      )}
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
                  onClick={() => handleFileClick(file)} // <-- Add this line to open sidebar when clicking a table row
                >
                  <td className="py-3 px-4 flex items-center">
                    {file.format.startsWith("image/") && (
                      <div className="w-12 h-12 mr-3 overflow-hidden rounded-lg">
                        <img
                          src={file.secure_url}
                          alt={file.original_filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {getFileTypeIcon(file.format)}
                    <span className="ml-2 text-gray-700">
                      {file.original_filename}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {file.width}x{file.height}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {formatToMonthDayYear(file.created_at)}
                  </td>
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(file); // Open delete confirmation modal
                      }}
                      className="text-red-500 hover:underline focus:outline-none ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Load More Button (Only shown when there are more files to load) */}
          {filteredFiles.length > 0 && !isLoading && hasMoreFiles && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="border-2 border-blue-500 text-blue-500 py-2 px-4 hover:bg-blue-500 hover:text-white transition duration-200"
              >
                Load More
              </button>
            </div>
          )}
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

                <p className="text-sm font-semibold text-center text-gray-800">
                  {file.original_filename}
                </p>
                <p className="text-xs text-center text-gray-600">
                  {formatFileSize(file.size)}
                </p>
                <p className="text-xs text-center text-gray-600">
                  {file.width}x{file.height}
                </p>
                <p className="text-xs text-center text-gray-600">
                  {formatToMonthDayYear(file.created_at)}
                </p>
                <p className="text-xs text-center text-gray-600">
                  {file.format}
                </p>

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
        {/* Load More Button (Only shown when there are more files to load) */}
        {filteredFiles.length > 0 && !isLoading && hasMoreFiles && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="border-2 border-blue-500 text-blue-500 py-2 px-4 hover:bg-blue-500 hover:text-white transition duration-200"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3">
            {/* Header with light red background for both the delete info and question */}
            <div className="bg-red-100 p-4 rounded-t-lg">
              <h3 className="text-2xl font-semibold text-gray-700">
                Delete file
              </h3>
              <h3 className="text-sm font-semibold text-gray-700 mt-2">
                Are you sure you want to delete this file?
              </h3>
            </div>

            {/* Info about deleting data */}
            <p className="text-sm text-gray-600 px-6 py-2">
              Doing so will permanently delete the file at this location,
              including in the database.
            </p>

            <div className="flex justify-between px-6 py-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replace the existing selectedFile sidebar with the new component */}
      <FileDetailSidebar
        selectedFile={selectedFile}
        onClose={handleCloseSidebar}
        onDownload={handleDownload}
        formatFileSize={formatFileSize}
        formatToMonthDayYear={formatToMonthDayYear}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Media;
