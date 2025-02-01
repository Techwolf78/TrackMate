import { useState } from "react";
import { db } from "../firebaseConfig";
import { ref, set } from "firebase/database";
import SpentModal from "./SpentModal";
import BillsModal from "./BillsModal";

function Submit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  // Toast notifications
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleSave = (spentData) => {
    const {
      allocatedAmount,
      spentAmount,
      visitType,
      college,
      additionalColleges
    } = spentData;

    // Validate that all required fields are filled
    if (
      allocatedAmount &&
      spentAmount &&
      visitType &&
      (college || additionalColleges.length > 0)
    ) {
      console.log("Data Saved:", spentData);

      // Close the modal and reset form fields
      setIsModalOpen(false);

      // Show success toast after saving data
      setShowSuccessToast(true);

      // Hide success toast after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
    } else {
      alert("Please fill out all fields.");
    }
  };

  const saveToFirebase = (fileData) => {
    const formattedDate = new Date(fileData.created_at).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const dbData = {
      secure_url: fileData.secure_url,
      public_id: fileData.public_id,
      original_filename: fileData.original_filename,
      size: fileData.bytes,
      format: fileData.format,
      created_at: formattedDate
    };

    set(ref(db, `uploaded_files/${Date.now()}`), dbData)
      .catch((error) => {
        console.error("Firebase save error:", error);
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      });
  };

  return (
    <div className="flex justify-center font-inter items-center bg-white mb-10 pt-2 pb-4">
      <div className="flex space-x-12 max-w-2xl">
        <button
          className="bg-white text-blue-500 border-2 border-blue-500 px-10 py-2 w-full hover:bg-blue-500 hover:text-white hover:border-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Spent
        </button>
        <button
          className="bg-white text-blue-500 border-2 border-blue-500 px-10 py-2 w-full hover:bg-blue-500 hover:text-white hover:border-blue-600"
          onClick={() => setIsBillModalOpen(true)}
        >
          Bills
        </button>
        <button
          className="bg-white text-blue-500 border-2 border-blue-500 px-10 py-2 w-full hover:bg-blue-500 hover:text-white hover:border-blue-600 whitespace-nowrap"
          onClick={() => setIsBillModalOpen(true)}
        >
          Placement Docs
        </button>
      </div>

      <SpentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSave={handleSave}
      />

      <BillsModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        saveToFirebase={saveToFirebase}
        setShowSuccessToast={setShowSuccessToast}
        setShowErrorToast={setShowErrorToast}
      />

      {/* Toast Notifications */}
      {showSuccessToast && (
        <div className="fixed top-2 left-2 right-2 bg-green-500 text-white text-center py-3 z-50">
          <p>Data saved successfully!</p>
        </div>
      )}
      {showErrorToast && (
        <div className="fixed top-2 left-2 right-2 bg-red-500 text-white text-center py-3 z-50">
          <p>Upload failed. Please try again.</p>
        </div>
      )}
    </div>
  );
}

export default Submit;
