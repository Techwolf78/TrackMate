import PropTypes from 'prop-types';
import { useState } from 'react';

const SpentModal = ({ isOpen, onClose, handleSave }) => {
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [spentAmount, setSpentAmount] = useState("");
  const [visitType, setVisitType] = useState("");  // New state for Visit Type
  const [college, setCollege] = useState("");      // New state for College
  const [otherCollegeName, setOtherCollegeName] = useState("");  // State for other college name
  const [additionalColleges, setAdditionalColleges] = useState([]);  // New state for dynamic colleges

  if (!isOpen) return null;

  // List of predefined colleges
  const colleges = [
    "College A", "College B", "College C", "College D", 
    "College E", "College F", "College G", "College H", 
    "College I", "College J"
  ];

  // Handle adding new college fields
  const handleAddCollege = () => {
    setAdditionalColleges([...additionalColleges, ""]);
  };

  // Handle changing the value of a specific college field
  const handleCollegeChange = (index, value) => {
    const newColleges = [...additionalColleges];
    newColleges[index] = value;
    setAdditionalColleges(newColleges);
  };

  // Handle deleting a specific college field
  const handleDeleteCollege = (index) => {
    const newColleges = additionalColleges.filter((_, i) => i !== index);
    setAdditionalColleges(newColleges);
  };

  const handleFormSubmit = () => {
    const spentData = {
      allocatedAmount,
      spentAmount,
      visitType,
      college: college === "Other" ? otherCollegeName : college,  // Handle "Other" option
      additionalColleges,
    };
    handleSave(spentData); // Pass data to parent component
    // Reset form fields
    setAllocatedAmount("");
    setSpentAmount("");
    setVisitType("");
    setCollege("");
    setOtherCollegeName("");
    setAdditionalColleges([]);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-2 mb-12">
      <div className="bg-white p-4 rounded-lg max-w-lg w-full relative">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="font-bold text-xl">×</span>
        </div>
        <h3 className="text-xl text-gray-700 font-semibold">Spent</h3>

        {/* Visit Type Dropdown */}
        <div className="mt-4">
          <label className="text-gray-700 font-medium">Visit Type:</label>
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
          >
            <option value="">Select Visit Type</option>
            <option value="Single Visit">Single Visit</option>
            <option value="Multiple Visit">Multiple Visit</option>
          </select>
        </div>

        {/* College Dropdown */}
        <div className="mt-4">
          <label className="text-gray-700 font-medium">College:</label>
          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
          >
            <option value="">Select College</option>
            {colleges.map((col, index) => (
              <option key={index} value={col}>{col}</option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Conditional input for "Other College Name" */}
        {college === "Other" && (
          <div className="mt-4">
            <label className="text-gray-700 font-medium">Other College Name:</label>
            <input
              type="text"
              value={otherCollegeName}
              onChange={(e) => setOtherCollegeName(e.target.value)}
              className="border border-gray-300 rounded-md w-full p-2 mt-2"
              placeholder="Enter College Name"
            />
          </div>
        )}

        {/* Additional Colleges - Dynamic Fields */}
        {visitType === "Multiple Visit" && (
          <>
{additionalColleges.map((college, index) => (
  <div key={index} className="mt-4">
    {/* College Input Field */}
    <div>
      <label className="text-gray-700 font-medium">College Name {index + 2}:</label>
      <input
        type="text"
        value={college}
        onChange={(e) => handleCollegeChange(index, e.target.value)}
        className="border border-gray-300 rounded-md w-full p-2 mt-2"
        placeholder={`Enter college name ${index + 2}`}
      />
    </div>

    {/* Delete Icon - Positioned Below the Input Field */}
    <div className="flex justify-end mt-2">
      <button
        onClick={() => handleDeleteCollege(index)}
        className="text-red-500 hover:text-red-700 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span className="ml-1">Delete</span>
      </button>
    </div>
  </div>
))}
{/* "Add+" Button */}
<button
  onClick={handleAddCollege}
  className="flex items-center justify-center mt-4 text-indigo-500 hover:text-indigo-700 border border-indigo-500 hover:border-indigo-700 rounded-md px-3 py-1.5 text-sm transition-all"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
  <span>Add College</span>
</button>
          </>
        )}

        {/* Allocated Amount Field */}
        <div className="mt-4">
          <label className="text-gray-700 font-medium">Allocated Amount:</label>
          <input
            type="number"
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
            placeholder="Enter Allocated Amount"
          />
        </div>

        {/* Spent Amount Field */}
        <div className="mt-4">
          <label className="text-gray-700 font-medium">Spent Amount:</label>
          <input
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            className="border border-gray-300 rounded-md w-full p-2 mt-2"
            placeholder="Enter Spent Amount"
          />
        </div>

        {/* Buttons for Cancel and Save */}
        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
            onClick={handleFormSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

SpentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default SpentModal;