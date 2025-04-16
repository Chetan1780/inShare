import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { showToast } from '@/Helper/ShowToast';
import { FaCopy } from "react-icons/fa6";
import { useSelector } from 'react-redux';
const Uploader = ({ onUploadSuccess }) => {
  const [isDragged, setIsDragged] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isUploading) {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [isUploading]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragged(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragged(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragged(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragged(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setSelectedFiles(droppedFiles);
    }
  };

  const handleFileChange = (e) => {
    const inputFiles = Array.from(e.target.files);
    if (inputFiles.length > 0) {
      setSelectedFiles(inputFiles);
    }
  };

  // const user = useSelector((state) => state.user);
  const handleSubmit = async () => {
    // if (!user || !user.token) {
    //   showToast("error", "Please log in to upload a file!", 0);
    //   return;
    // }
  
    if (selectedFiles.length === 0) return;
  
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
  
    setIsUploading(true);
    setUploadSuccess(null);
    setUploadProgress(0);
  
    const xhr = new XMLHttpRequest();
  
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((100 * e.loaded) / e.total);
        setUploadProgress(percent);
      }
    };
  
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        setUploadResult({ objectId: data.id });
        setUploadSuccess(true);
        showToast("success", "File Uploaded Successfully!!");
        onUploadSuccess();
      } catch (error) {
        setUploadSuccess(false);
        showToast("error", "Invalid response from server!");
      } finally {
        setIsUploading(false);
      }
    };
  
    xhr.onerror = () => {
      setUploadSuccess(false);
      setIsUploading(false);
      showToast("error", "File upload failed! Please try again.");
    };
  
    xhr.open("POST", `${import.meta.env.VITE_API_BACKEND_URL}/api/files/upload`, true);
    xhr.withCredentials = true;
    xhr.send(formData);
  };
  



  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleReselect = () => {
    setSelectedFiles([]);
    setUploadSuccess(null);
  };
  return (
    <section className="upload-container flex-grow flex justify-center items-center p-24 ">
      <div className="shadow-2xl rounded-3xl bg-white p-6">
        {/* Your entire upload UI stays here */}
        <div
          className={`drop-zone flex flex-col justify-center items-center w-[500px] min-h-[200px] m-8 border-2 rounded-lg border-dashed border-[#0288d147]  ${isDragged ? 'dragged' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="icon-container w-[75px] relative h-[100px]">
            <img src="file.svg" className="center z-10 img" alt="File icon" draggable="false" />
            <img src="file.svg" className="right img" alt="File icon" draggable="false" />
            <img src="file.svg" className="left img" alt="File icon" draggable="false" />
          </div>

          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="title">
            Drop your Files here or,{' '}
            <span onClick={handleClick} className="browseButton cursor-pointer text-[#0289d1]">
              Browse
            </span>
          </div>
        </div>

        {selectedFiles.length > 0 && !isUploading && !uploadSuccess && (
          <div className="file-list p-4">
            <h3 className="font-semibold">Files:</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {selectedFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {isUploading && (
          <div className="p-4 text-center">
            <div className="text-sm text-gray-700 mb-2">Uploading PDF... {uploadProgress}%</div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}


        {uploadSuccess !== null && (
          <div className={`p-4 text-center ${uploadSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {uploadSuccess ? (
              <div className="space-y-4">
                <div className="text-lg font-semibold text-green-700">✅ File Uploaded Successfully!</div>

                <CopyToClipboard text={`${import.meta.env.VITE_API_FRONTEND_URL}/pdf-view/${uploadResult?.objectId}`}>
                  <div
                    onClick={() => showToast("success", "Link copied to clipboard!")}
                    className="flex items-center justify-center gap-2 cursor-pointer bg-gray-100 text-gray-800 font-mono text-xs px-4 py-2 rounded-md border border-gray-300 shadow-inner hover:bg-gray-200 transition"
                  >
                    <span className="break-all text-center">
                      {import.meta.env.VITE_API_FRONTEND_URL}/pdf-view/{uploadResult?.objectId}
                    </span>
                    <FaCopy />
                  </div>
                </CopyToClipboard>
              </div>
            ) : (
              <div className="text-red-600 font-semibold text-lg">❌ Upload Failed! Please try again.</div>
            )}
          </div>
        )}

        <div className="buttons flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`px-5 py-2 rounded-full text-white text-sm font-medium transition ${isUploading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isUploading ? 'Uploading PDF...' : '📤 Upload & Generate Link'}
          </button>

          <button
            onClick={handleReselect}
            disabled={selectedFiles.length === 0}
            className={`px-5 py-2 rounded-full text-white text-sm font-medium transition ${selectedFiles.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700'
              }`}
          >
            🔄 Choose Another File
          </button>
        </div>

      </div>
    </section>
  )
}

export default Uploader
