import React, { useState } from "react";

function UploadImage({ uploadImage }) {
  const [fileName, setFileName] = useState(""); 
  const [imagePreview, setImagePreview] = useState(null); 

  // Handle file input change event
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileName(file); 
    uploadImage(file); 

    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file); 
    }
    
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  return (
    <div>
      {/* Label for file input */}
      <label
        htmlFor="fileInput"
        className="inline-block rounded-md shadow-sm py-2 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg
          className="inline-block mr-2"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 16V21H21V16H3ZM5 18H19V16H5V18ZM3 6H21V14H3V6ZM5 10H19V8H5V10Z"
            fill="currentColor"
          />
        </svg>

        {/* Display file name or "Choose file" */}
        <span className="inline-block">
          {fileName?.name ? fileName.name : "Choose file"}
        </span>
      </label>

      {/* Hidden file input */}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept=".png, .jpeg, .jpg"
        required
        onChange={handleFileInputChange}
      />

      {/* Display image preview if there is one */}
      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Image Preview"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}
    </div>
  );
}

export default UploadImage;
