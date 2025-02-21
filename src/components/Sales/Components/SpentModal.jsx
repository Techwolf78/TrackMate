import PropTypes from "prop-types";
import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "../../../firebaseConfig";
import CollegeList from "./CollegeList"; // Import the CollegeList component

const SpentModal = ({ isOpen, onClose, handleSave }) => {
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [spentAmount, setSpentAmount] = useState("");
  const [visitType, setVisitType] = useState("");
  const [college, setCollege] = useState("");
  const [otherCollegeName, setOtherCollegeName] = useState("");
  const [additionalColleges, setAdditionalColleges] = useState([]);
  const [food, setFood] = useState("");
  const [fuel, setFuel] = useState("");
  const [stay, setStay] = useState("");
  const [toll, setToll] = useState("");

  if (!isOpen) return null;

  const handleAddCollege = () => {
    setAdditionalColleges([...additionalColleges, ""]);
  };

  const handleCollegeChange = (index, value) => {
    const newColleges = [...additionalColleges];
    newColleges[index] = value;
    setAdditionalColleges(newColleges);
  };

  const handleDeleteCollege = (index) => {
    const newColleges = additionalColleges.filter((_, i) => i !== index);
    setAdditionalColleges(newColleges);
  };

  const handleFormSubmit = () => {
    // Calculate the total number of colleges (including the main college and additional colleges)
    const totalColleges =
      additionalColleges.length +
      (college === "Other" ? 1 : 0) +
      (college !== "" && college !== "Other" ? 1 : 0);
  
    // Calculate the split amounts for food, fuel, stay, and toll
    const foodSplit = (parseFloat(food) || 0) / totalColleges;
    const fuelSplit = (parseFloat(fuel) || 0) / totalColleges;
    const staySplit = (parseFloat(stay) || 0) / totalColleges;
    const tollSplit = (parseFloat(toll) || 0) / totalColleges;
  
    // Create an array to hold the spent data for each college
    const spentDataArray = [];
  
    // Add the main college (or selected college)
    const mainCollege = college === "Other" ? otherCollegeName : college;
    if (college !== "") {  // Ensure the selected college is added
      spentDataArray.push({
        allocatedAmount: allocatedAmount / totalColleges,
        spentAmount: spentAmount / totalColleges,
        visitType,
        college: mainCollege, // Save the selected college
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
      });
    }
  
    // Add the additional colleges
    additionalColleges.forEach((collegeName) => {
      spentDataArray.push({
        allocatedAmount: allocatedAmount / totalColleges,
        spentAmount: spentAmount / totalColleges,
        visitType,
        college: collegeName, // This is for additional colleges
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
      });
    });
  
    // Save each spent data record to the database
    spentDataArray.forEach((spentData) => {
      const newSpentRef = ref(db, "sales_spent/" + Date.now());
      set(newSpentRef, spentData)
        .then(() => {
          console.log("Data saved successfully!");
          handleSave(spentData);
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    });
  
    // Reset the form fields after submission
    setAllocatedAmount("");
    setSpentAmount("");
    setVisitType("");
    setCollege("");
    setOtherCollegeName("");
    setAdditionalColleges([]);
    setFood("");
    setFuel("");
    setStay("");
    setToll("");
  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-2 mb-12">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto shadow-lg">
        <div
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="font-bold text-xl">×</span>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Spent
        </h3>

        <div className="space-y-4">
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="">Visit Type</option>
            <option value="Single Visit">Single Visit</option>
            <option value="Multiple Visit">Multiple Visit</option>
          </select>

          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          >
            <option value="">Select College</option>
            <CollegeList /> {/* Use CollegeList here */}
          </select>

          {college === "Other" && (
            <input
              type="text"
              value={otherCollegeName}
              onChange={(e) => setOtherCollegeName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Enter Other College Name"
            />
          )}

          {visitType === "Multiple Visit" &&
            additionalColleges.map((college, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={college}
                  onChange={(e) => handleCollegeChange(index, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                  placeholder={`College ${index + 2}`}
                />
                <button
                  onClick={() => handleDeleteCollege(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  ✖
                </button>
              </div>
            ))}

          {visitType === "Multiple Visit" && (
            <button
              onClick={handleAddCollege}
              className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              Add College
            </button>
          )}

          <input
            type="number"
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Allocated Amount"
          />

          <input
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Spent Amount"
          />

          <input
            type="number"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Food Amount"
          />

          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Fuel Amount"
          />

          <input
            type="number"
            value={stay}
            onChange={(e) => setStay(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Stay Amount"
          />

          <input
            type="number"
            value={toll}
            onChange={(e) => setToll(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            placeholder="Toll Amount"
          />
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
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
