import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SalesForm() {
  const [formData, setFormData] = useState({
    collegeName: "",
    city: "",
    clientName: "",
    clientDesignation: "",
    clientContact: "",
    salesRep: "",
    visitPurpose: "",
    courses: "",
    visitPhase: "",
    autoDate: "",
    studentCount: "",
    perStudentRate: "",
    totalContractValue: "",
    remarks: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Dynamically generate Visit Code for Sales
  const generateVisitCode = () => {
    return `SALES-VIST-${Math.floor(Math.random() * 10000)}`; // Unique visit code for Sales
  };

  // Use sessionStorage to persist visitCode for Sales
  const [visitCode, setVisitCode] = useState(
    sessionStorage.getItem("salesVisitCode") || generateVisitCode()
  );

  // Store the generated visitCode in sessionStorage for Sales if it wasn't already set
  useEffect(() => {
    if (!sessionStorage.getItem("salesVisitCode")) {
      sessionStorage.setItem("salesVisitCode", visitCode);
    }
  }, [visitCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
    setIsLoading(true);
  
    // Prepare the data to be sent
    const data = {
      visitCode: visitCode, // Use the sales-specific visitCode here
      collegeName: formData.collegeName,
      city: formData.city,
      clientName: formData.clientName,
      clientDesignation: formData.clientDesignation,
      clientContact: formData.clientContact,
      salesRep: formData.salesRep,
      visitPurpose: formData.visitPurpose,
      courses: formData.courses,
      visitPhase: formData.visitPhase,
      autoDate: formData.autoDate,
      studentCount: formData.studentCount,
      perStudentRate: formData.perStudentRate,
      totalContractValue: formData.totalContractValue,
      remarks: formData.remarks,
    };
  
    console.log("Data to be sent:", data); // Log the data being sent to the API
  
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwOcxnhBVBjjwP8ZrRe-RtpNcc3xnwUaqBDV4IyeeD_IjygzNLSajhqJfka5ruChHQ/exec",
        {
          method: 'POST',
          mode: 'no-cors', // No-cors mode
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
  
      // Since we are using no-cors, we cannot access response content
      console.log("Request sent, but cannot access the response body due to 'no-cors' mode.");
  
      // Since no-cors doesn't allow us to check the response body,
      // assume the request is successful if no errors were thrown.
      setSuccessMessage("Data submitted successfully!");
    } catch (error) {
      console.error("Error during submission:", error); // Log the error
      setSuccessMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);

      // Close the modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false); // Close modal
        setSuccessMessage(""); // Clear success message
        setFormData({ // Reset form data
          collegeName: "",
          city: "",
          clientName: "",
          clientDesignation: "",
          clientContact: "",
          salesRep: "",
          visitPurpose: "",
          courses: "",
          visitPhase: "",
          autoDate: "",
          studentCount: "",
          perStudentRate: "",
          totalContractValue: "",
          remarks: "",
        });

        // Reset visitCode (clear sessionStorage so it regenerates next time)
        sessionStorage.removeItem("salesVisitCode");
        setVisitCode(generateVisitCode()); // Generate a new visitCode
      }, 2000);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const formClass = "bg-white p-8 max-w-3xl w-full font-inter";
  const inputClass =
    "mt-2 p-3 w-full bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";
  const buttonClass =
    "bg-white text-teal-500 border border-teal-500 hover:bg-teal-500 hover:text-white hover:border-teal-600 transition duration-300 px-6 py-3 font-semibold rounded-lg w-full";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-teal-100 to-slate-50">
      <form onSubmit={handleSubmit} className={formClass}>
        <div className="flex justify-between items-center mb-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="text-sm font-semibold underline flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m7-7l-7 7 7 7"
              />
            </svg>
            Back
          </button>

          {/* Visit Code */}
          <div className="text-sm font-semibold">{visitCode}</div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">College Name</label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Client Designation
            </label>
            <input
              type="text"
              name="clientDesignation"
              value={formData.clientDesignation}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Contact</label>
            <input
              type="text"
              name="clientContact"
              value={formData.clientContact}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Sales Rep</label>
            <select
              name="salesRep"
              value={formData.salesRep}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Sales Rep</option>
              <option value="Dheeraj">Dheeraj Jalali</option>
              <option value="Nishad">Nishad Kulkarni</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Visit Purpose</label>
            <input
              type="text"
              name="visitPurpose"
              value={formData.visitPurpose}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Courses</label>
            <input
              type="text"
              name="courses"
              value={formData.courses}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Visit Phase</label>
            <input
              type="text"
              name="visitPhase"
              value={formData.visitPhase}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Auto Date</label>
            <input
              type="date"
              name="autoDate"
              value={formData.autoDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Student Count</label>
            <input
              type="number"
              name="studentCount"
              value={formData.studentCount}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Per Student Rate
            </label>
            <input
              type="number"
              name="perStudentRate"
              value={formData.perStudentRate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Total Contract Value
            </label>
            <input
              type="number"
              name="totalContractValue"
              value={formData.totalContractValue}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Remarks for Next Visit
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center mt-8">
            <button type="submit" className={buttonClass}>
              Submit
            </button>
          </div>
        </div>
      </form>

      {/* Overlay Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div>
              {isLoading ? (
                <>
                  <div className="text-xl font-semibold mb-4">Saving...</div>
                  <div className="animate-spin rounded-full border-t-4 border-teal-500 w-12 h-12 mx-auto mb-4"></div>
                </>
              ) : (
                <>
                  <div className="text-xl font-semibold mb-4">
                    {successMessage}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesForm;
