import React, { useState } from "react";
import { getDatabase, ref, set, get } from "firebase/database";
import { db } from "../firebaseConfig"; // Use named import instead of default

// No need to initialize Firebase again here
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);  <-- Remove this line

function PlacementFormSubmit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spentAmount, setSpentAmount] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const CLOUD_NAME = "dcjmaapvi";
  const UPLOAD_PRESET = "tracker";

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (spentAmount) {
      setSavedData({ allocatedAmount: 5000, spentAmount });
      setIsModalOpen(false);
      setSpentAmount("");
      console.log("Data Saved:", { allocatedAmount: 5000, spentAmount });
    } else {
      alert("Please enter a spent amount");
    }
  };

  const handleOpenBillModal = () => setIsBillModalOpen(true);
  const handleCloseBillModal = () => {
    setIsBillModalOpen(false);
    setFiles([]);
    setUploadProgress([]);
    setIsUploading(false);
    setCurrentFileIndex(0);
    setUploadStatus("");
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validTypes = ["image/png", "image/jpeg", "image/jpg"]; // Only allow image files
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const newFiles = selectedFiles.filter((file) => {
      if (validTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          return true;
        } else {
          alert(
            `${file.name} is too large! Please upload a file smaller than 10MB.`
          );
          return false;
        }
      } else {
        alert(
          "Invalid file type. Only image files (JPG, PNG, JPEG) are allowed."
        );
        return false;
      }
    });

    if (newFiles.length > 0) {
      setFiles([...files, ...newFiles]);
      setUploadProgress([...uploadProgress, ...newFiles.map(() => 0)]);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newProgress = [...uploadProgress];
    newProgress.splice(index, 1);
    setUploadProgress(newProgress);
  };

  const handleUploadClick = () => {
    if (
      files.length === 0 ||
      files.some((file) => file.size > 10 * 1024 * 1024)
    ) {
      alert("Please select an image file less than 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading");
    setCurrentFileIndex(0);
    uploadFile(files[0], 0);
  };

  const uploadFile = (file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      true
    );

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress((prevProgress) =>
          prevProgress.map((prog, i) => (i === index ? progress : prog))
        );
      }
    };

    xhr.onload = function () {
      const response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        console.log("File uploaded successfully:", response);
        const fileUrl = response.secure_url;
        const formattedDate = formatDate(response.created_at); // Format the created_at timestamp

        // Capture the format field from Cloudinary metadata
        const fileData = {
          secure_url: fileUrl,
          public_id: response.public_id,
          original_filename: response.original_filename,
          size: response.bytes,
          width: response.width,
          height: response.height,
          format: response.format, // Add format field here
          created_at: formattedDate, // Save the formatted date here
        };

        // Save the file metadata to Firebase
        saveToFirebase(fileData);

        if (index < files.length - 1) {
          setCurrentFileIndex(index + 1);
          uploadFile(files[index + 1], index + 1);
        } else {
          setIsUploading(false);
          setShowSuccessToast(true);
          setIsBillModalOpen(false);

          setTimeout(() => {
            setShowSuccessToast(false);
            setFiles([]);
            setUploadProgress([]);
            setCurrentFileIndex(0);
            setUploadStatus("");
          }, 3000);
        }
      } else {
        console.error("Upload failed:", xhr.responseText);
        setIsUploading(false);
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
      }
    };

    xhr.onerror = function () {
      console.error("Upload failed");
      setIsUploading(false);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    };

    try {
      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file", error);
      setIsUploading(false);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  // Save data to Firebase Realtime Database
  // Save data to Firebase Realtime Database
  const saveToFirebase = (fileData) => {
    const dataRef = ref(db, "uploaded_files/" + Date.now()); // Using timestamp as the key
    set(dataRef, fileData)
      .then(() => {
        console.log("File metadata saved to Firebase");
      })
      .catch((error) => {
        console.error("Error saving data to Firebase:", error);
      });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // Function to format the `created_at` timestamp into AM/PM format
  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // Convert the ISO string into a Date object

    // Define options for formatting
    const options = {
      weekday: "short", // Weekday (e.g., Mon, Tue)
      year: "numeric", // Full year (e.g., 2025)
      month: "short", // Short month (e.g., Jan, Feb)
      day: "numeric", // Day of the month (e.g., 3)
      hour: "2-digit", // Hour (e.g., 09, 12)
      minute: "2-digit", // Minute (e.g., 48)
      second: "2-digit", // Second (e.g., 42)
      hour12: true, // Use 12-hour clock (AM/PM)
    };

    // Format the date to AM/PM format
    return date.toLocaleString("en-US", options);
  };

  return (
    <div className="flex justify-center font-inter items-center bg-white  mb-10 pt-2 pb-4">
<div className="flex space-x-12 max-w-2xl ">
        <button
          className="bg-white text-blue-500 border-2 border-blue-500 px-10 py-2  w-full hover:bg-blue-500 hover:text-white hover:border-blue-600"
          onClick={handleOpenModal}
        >
          Spent
        </button>
        <button
          className="bg-white text-blue-500 border-2 border-blue-500 px-10 py-2  w-full hover:bg-blue-500 hover:text-white hover:border-blue-600"
          onClick={handleOpenBillModal}
        >
          Bills
        </button>
      </div>

      {/* Spent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-2">
          <div className="bg-white p-4 rounded-lg  max-w-lg w-full relative">
            <div
              onClick={handleCloseModal}
              className="absolute top-2 right-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="font-bold text-xl">×</span>
            </div>
            <h3 className="text-xl text-gray-700 font-semibold">Spent</h3>

            <div className="mt-4">
              <label className="text-gray-700 font-medium">
                Enter Spent Amount:
              </label>
              <input
                type="number"
                value={spentAmount}
                onChange={(e) => setSpentAmount(e.target.value)}
                className="border border-gray-300 rounded-md w-full p-2 mt-2"
                placeholder="Enter the amount you spent"
              />
            </div>

            <div className="mt-4 flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bills Modal */}
      {isBillModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-2">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
            <div
              onClick={handleCloseBillModal}
              className="absolute top-2 right-2 w-8 h-8 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="font-bold text-xl">×</span>
            </div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-gray-400 text-white flex items-center justify-center rounded-full mr-4">
                <img src="./upload.png" alt="Upload Icon" className="w-6 h-6" />
              </div>
              <h3 className="text-xl text-gray-700 font-semibold">
                Upload Your Bills
              </h3>
            </div>

            {/* Drag and Drop Area */}
            <div className="text-center">
              <p className="text-base font-medium text-gray-700">
                Drag & Drop your file here
              </p>
              <div className="border-dashed border-2 p-8 rounded-xl border-gray-400 mt-4 relative">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center text-gray-500">
                  <p>OR</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to select files
                  </p>
                </div>
                <button
                  className="mt-2 bg-white border-4 border-gray-200 text-gray-700 text-xs px-1 py-1 rounded-full"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                >
                  Browse Files
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: JPG, PNG (up to 10MB)
              </p>
            </div>

            {/* Scrollable File List */}
            {files.length > 0 && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-md"
                    >
                      <span className="text-sm text-gray-600">
                        {file.name} ({formatFileSize(file.size)})
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 font-bold text-xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress message */}
            {isUploading && files.length > 0 && (
              <div className="mt-6">
                {files.map((file, index) => (
                  <div key={index} className="mt-4">
                    <div className="text-sm text-gray-600">
                      Uploading {file.name}...
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded h-2">
                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${uploadProgress[index]}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {uploadProgress[index]}%
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg"
                onClick={handleUploadClick}
                disabled={
                  files.length === 0 ||
                  files.some((file) => file.size > 10 * 1024 * 1024)
                }
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-2 left-2 right-2 bg-green-500 text-white text-center py-3 z-50">
          <p>Your bill has been uploaded successfully!</p>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed top-2 left-2 right-2 bg-red-500 text-white text-center py-3 z-50">
          <p>
            Your file is either too large or not an image. Only images under
            10MB are allowed.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlacementFormSubmit;
