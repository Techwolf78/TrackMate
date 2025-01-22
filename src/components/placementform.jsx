import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PlacementForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    city: "",
    clientName: "",
    clientDesignation: "",
    clientEmail: "",
    clientContact: "",
    crRep: "",
    visitPurpose: "",
    industry: "",
    domain: "",
    hiringPeriod: "",
    numbersForHiring: "",
    pitched: "",
    jdReceived: "",
    studentCount: "", // Assuming you have these fields already
    perStudentRate: "", // Assuming you have these fields already
    totalValueContract: "", // Optional manual input for total value
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  // Dynamically generate Visit Code for Placement
  const generateVisitCode = () => {
    return `PLACEMENT-VIST-${Math.floor(Math.random() * 10000)}`; // Unique visit code for Placement
  };

  // Use sessionStorage to persist visitCode for Placement
  const [visitCode, setVisitCode] = useState(
    sessionStorage.getItem("placementVisitCode") || generateVisitCode()
  );

  // Store the generated visitCode in sessionStorage if not already set
  useEffect(() => {
    if (!sessionStorage.getItem("placementVisitCode")) {
      sessionStorage.setItem("placementVisitCode", visitCode);
    }
  }, [visitCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to calculate Total Value Contract automatically
  const calculateTotalValueContract = () => {
    const studentCount = parseInt(formData.studentCount, 10);
    const perStudentRate = parseFloat(formData.perStudentRate);
    if (!isNaN(studentCount) && !isNaN(perStudentRate)) {
      return studentCount * perStudentRate;
    }
    return ""; // Return empty if calculation can't be made
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsModalOpen(true);
    setIsLoading(true);

    // Prepare the data to be sent, including the dynamically generated visitCode
    const data = {
      visitCode: visitCode, // Use the placement-specific visitCode here
      companyName: formData.companyName,
      city: formData.city,
      clientName: formData.clientName,
      clientDesignation: formData.clientDesignation,
      clientEmail: formData.clientEmail,
      clientContact: formData.clientContact,
      crRep: formData.crRep,
      visitPurpose: formData.visitPurpose,
      industry: formData.industry,
      domain: formData.domain,
      hiringPeriod: formData.hiringPeriod,
      numbersForHiring: formData.numbersForHiring,
      pitched: formData.pitched,
      jdReceived: formData.jdReceived,
      totalValueContract: formData.totalValueContract || calculateTotalValueContract(), // Use calculated or manually entered value
    };

    try {
      // Just simulate submission (no need to parse the response)
      await fetch(
        "https://script.google.com/macros/s/AKfycbwWz8oqbN65VDZfW_Ics6eYqJcaIBiLnsS1kbjW15Ebak0Ez6mHyGAJJINFki5XuyU/exec",
        {
          method: "POST",
          mode: "no-cors", // No need to parse the response body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include", // Ensures cookies are sent if necessary (for CORS)
        }
      );

      // Show success message immediately after form submission
      setSuccessMessage("Your data has been successfully submitted!");

      // Reset form data
      setFormData({
        companyName: "",
        city: "",
        clientName: "",
        clientDesignation: "",
        clientEmail: "",
        clientContact: "",
        crRep: "",
        visitPurpose: "",
        industry: "",
        domain: "",
        hiringPeriod: "",
        numbersForHiring: "",
        pitched: "",
        jdReceived: "",
        studentCount: "",
        perStudentRate: "",
        totalValueContract: "",
      });

      // After successful submission, generate a new visitCode for Placement
      const newVisitCode = generateVisitCode();
      sessionStorage.setItem("placementVisitCode", newVisitCode);
      setVisitCode(newVisitCode);

      // Optionally hide the modal after a short delay
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      setSuccessMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const formClass = "bg-white p-8 max-w-3xl w-full font-inter";
  const inputClass =
    "mt-2 p-3 w-full border-b-2 border-gray-300 bg-transparent focus:outline-none focus:ring-0 focus:border-teal-500"; // Underline style added
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
            <label className="block text-sm font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
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
            <label className="block text-sm font-medium">Client Designation</label>
            <input
              type="text"
              name="clientDesignation"
              value={formData.clientDesignation}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Email ID</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Client Contact No.</label>
            <input
              type="text"
              name="clientContact"
              value={formData.clientContact}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">CR Rep</label>
            <select
              name="crRep"
              value={formData.crRep}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select CR Rep</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
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
            <label className="block text-sm font-medium">Industry</label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Domain</label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Domain</option>
              <option value="Engineering">Engineering</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Hiring Period</label>
            <input
              type="text"
              name="hiringPeriod"
              value={formData.hiringPeriod}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Numbers for Hiring</label>
            <input
              type="number"
              name="numbersForHiring"
              value={formData.numbersForHiring}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pitched</label>
            <select
              name="pitched"
              value={formData.pitched}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Pitched</option>
              <option value="Colleges">Colleges</option>
              <option value="Gryphon">Gryphon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">JD Received</label>
            <input
              type="text"
              name="jdReceived"
              value={formData.jdReceived}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Student Count and Per Student Rate */}
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
            <label className="block text-sm font-medium">Per Student Rate</label>
            <input
              type="number"
              name="perStudentRate"
              value={formData.perStudentRate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Total Value Contract</label>
            <input
              type="number"
              name="totalValueContract"
              value={formData.totalValueContract || calculateTotalValueContract()}
              onChange={handleChange}
              className={inputClass}
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
                  <div className="text-xl font-semibold mb-4">{successMessage}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementForm;
