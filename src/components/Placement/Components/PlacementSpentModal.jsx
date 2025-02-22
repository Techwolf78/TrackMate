import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { ref, set, get } from "firebase/database";
import { db } from "../../../firebaseConfig";
import CompanyList from "../../Placement/Components/CompanyList"; // Import the CollegeList component
import { format } from "date-fns"; // Using date-fns for date formatting

const PlacementSpentModal = ({ isOpen, onClose, handleSave }) => {
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visitCode, setVisitCode] = useState(""); // For storing the Visit Code

  useEffect(() => {
    // Fetch the existing "Visit Codes" from Firebase to calculate the next one
    const fetchVisitCode = async () => {
      const visitCodeRef = ref(db, "sales_spent/");
      const snapshot = await get(visitCodeRef);
      
      if (snapshot.exists()) {
        const visitCodes = Object.values(snapshot.val()).map(item => item.visitCode);
        
        // Find the last visit code and increment it
        const maxVisitCode = visitCodes.reduce((max, code) => {
          const num = parseInt(code.split('_')[1], 10); // Get the number part
          return num > max ? num : max;
        }, 0);

        const nextVisitCode = `Placement_${String(maxVisitCode + 1).padStart(2, '0')}`;
        setVisitCode(nextVisitCode);
      } else {
        // If no records exist, start with Placement_01
        setVisitCode("Placement_01");
      }
    };

    if (isOpen) {
      fetchVisitCode(); // Fetch Visit Code when the modal is open
    }
  }, [isOpen]);

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
    const dateToSave = selectedDate.getTime();

    if (!allocatedAmount || !spentAmount || !visitType || !college) {
      alert("Please fill in all the required fields.");
      return;
    }

    const totalColleges = additionalColleges.length + (college === "Other" ? 1 : 0) + (college !== "" && college !== "Other" ? 1 : 0);

    const foodSplit = (parseFloat(food) || 0) / totalColleges;
    const fuelSplit = (parseFloat(fuel) || 0) / totalColleges;
    const staySplit = (parseFloat(stay) || 0) / totalColleges;
    const tollSplit = (parseFloat(toll) || 0) / totalColleges;

    const spentDataArray = [];

    const mainCollege = college === "Other" ? otherCollegeName : college;
    if (college !== "") {
      spentDataArray.push({
        visitCode, // Include the visitCode in the data
        allocatedAmount: allocatedAmount / totalColleges,
        spentAmount: spentAmount / totalColleges,
        visitType,
        college: mainCollege,
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave,
      });
    }

    additionalColleges.forEach((collegeName) => {
      spentDataArray.push({
        visitCode, // Include the visitCode in the data
        allocatedAmount: allocatedAmount / totalColleges,
        spentAmount: spentAmount / totalColleges,
        visitType,
        college: collegeName,
        food: foodSplit,
        fuel: fuelSplit,
        stay: staySplit,
        toll: tollSplit,
        date: dateToSave,
      });
    });

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

  const formatDate = (date) => {
    return format(date, "dd/MM/yyyy");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-1 mb-8">
      <div className="bg-white p-4 rounded-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto shadow-lg">
        <div
          onClick={onClose}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="font-bold text-lg">×</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Spent - {formatDate(selectedDate)}
        </h3>

        <div className="space-y-3">
          {/* Display the visit code (read-only) */}
          <input
            type="text"
            value={visitCode}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md text-gray-500 focus:outline-none"
            placeholder="Visit Code"
          />

          {/* Other form fields... */}
          <select
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
          >
            <option value="">Visit Type</option>
            <option value="Single Visit">Single Visit</option>
            <option value="Multiple Visit">Multiple Visit</option>
          </select>

          <select
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
          >
            <option value="">Select Company</option>
            <CompanyList /> {/* Use CollegeList here */}
          </select>

          {college === "Other" && (
            <input
              type="text"
              value={otherCollegeName}
              onChange={(e) => setOtherCollegeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
              placeholder="Enter Other College Name"
            />
          )}

          {visitType === "Multiple Visit" &&
            additionalColleges.map((college, index) => (
              <div key={index} className="flex items-center space-x-1">
                <input
                  type="text"
                  value={college}
                  onChange={(e) => handleCollegeChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
                  placeholder={`College ${index + 2}`}
                />
                <button
                  onClick={() => handleDeleteCollege(index)}
                  className="text-red-500 hover:text-red-700 transition text-sm"
                >
                  ✖
                </button>
              </div>
            ))}

          {visitType === "Multiple Visit" && (
            <button
              onClick={handleAddCollege}
              className="w-full p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm"
            >
              Add Company
            </button>
          )}

          <input
            type="number"
            value={allocatedAmount}
            onChange={(e) => setAllocatedAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Allocated Amount"
          />

          <input
            type="number"
            value={spentAmount}
            onChange={(e) => setSpentAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Spent Amount"
          />

          <input
            type="number"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Food Amount"
          />

          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Fuel Amount"
          />

          <input
            type="number"
            value={stay}
            onChange={(e) => setStay(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Stay Amount"
          />

          <input
            type="number"
            value={toll}
            onChange={(e) => setToll(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition text-sm"
            placeholder="Toll Amount"
          />
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded-md hover:bg-indigo-600 transition text-sm"
            onClick={handleFormSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

PlacementSpentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default PlacementSpentModal;
