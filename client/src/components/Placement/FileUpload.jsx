import React, { useRef, useState } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

const FileUpload = ({
  onFile,
  onClear,
  file,
  accept = ".pdf",
  maxMB = 5,
  error,
  helperText = "Upload your CV (PDF only, max 5MB)",
}) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    setLocalError(null);
    if (accept && !f.name.toLowerCase().endsWith(accept.replace(".", "").toLowerCase()) && accept !== "*") {
      setLocalError(`Only ${accept.toUpperCase()} files are allowed`);
      return;
    }
    if (f.size > maxMB * 1024 * 1024) {
      setLocalError(`File must be under ${maxMB}MB`);
      return;
    }
    onFile?.(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setLocalError(null);
    onClear?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const showError = error || localError;

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
          showError
            ? "border-red-300 bg-red-50/30"
            : dragOver
            ? "border-purple-500 bg-purple-50"
            : file
            ? "border-purple-200 bg-purple-50/30"
            : "border-gray-300 hover:border-purple-500 hover:bg-purple-50/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <FiFile className="w-5 h-5" />
            </div>
            <div className="text-left min-w-0 flex-1 max-w-xs">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {(file.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              aria-label="Remove file"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 mb-3">
              <FiUploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              {helperText}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Click to browse or drag &amp; drop
            </p>
          </>
        )}
      </div>

      {showError && (
        <p className="text-xs text-red-600 mt-1.5">{showError}</p>
      )}
    </div>
  );
};

export default FileUpload;
