import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { CopyToClipboard } from 'react-copy-to-clipboard'; 

function Home() {
  const [isDragged, setIsDragged] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false); 
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadResult, setUploadResult] = useState(null); 
  const navigate = useNavigate(); 

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

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFiles[0]);

    setIsUploading(true); 
    setUploadSuccess(null); 

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/files/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await resp.json();
      console.log(data);
      setUploadResult({
        objectId: data.id,
      }); 
      setUploadSuccess(true); 
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadSuccess(false); 
    } finally {
      setIsUploading(false); 
    }
  };

  
  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleReselect = () => {
    setSelectedFiles([]); 
    setUploadSuccess(null); 
  };

  const handleRedirect = () => {
    
    window.open(`/pdf-view/${uploadResult.objectId}`, '_blank');
  };

  return (
    <div className="main flex items-center justify-center border-2 font-[system-ui] bg-[#eff5fe] border-red-400 w-screen h-screen p-4">
      <section className="upload-container shadow-2xl rounded-3xl bg-white p-6">
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

        {/* Show uploading animation if uploading */}
        {isUploading && (
          <div className="uploading p-4 text-center">
            <div className="loader">Uploading...</div>
            <div className="loaderAnimation">
              <div className="spinner"></div>
            </div>
          </div>
        )}

        {/* Upload Success or Failure Message */}
        {uploadSuccess !== null && (
          <div className={`p-4 text-center ${uploadSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {uploadSuccess ? (
              <>
                <div>Upload Successful! ✅</div>
                <div className="mt-2 text-sm text-blue-600 underline cursor-pointer" onClick={handleRedirect}>
                  🔗 View your PDF in a new tab
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Or share this link: 
                  <span className="ml-1 text-gray-800 font-mono select-all">
                    {import.meta.env.VITE_API_FRONTEND_URL}/pdf-view/{uploadResult?.objectId}
                  </span>
                </div>
                <CopyToClipboard text={`${import.meta.env.VITE_API_FRONTEND_URL}/pdf-view/${uploadResult?.objectId}`}>
  <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
    Copy Link
  </button>
</CopyToClipboard>

              </>
            ) : (
              'Upload Failed! Please try again.'
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="buttons flex justify-center space-x-4 mt-4">
          <button onClick={handleSubmit} disabled={isUploading} className="bg-blue-500 text-white px-4 py-2 rounded">
            {isUploading ? 'Generating Sharable Link Please wait for a moment...' : 'Start Upload'}
          </button>
          <button onClick={handleReselect} disabled={selectedFiles.length === 0} className="bg-gray-500 text-white px-4 py-2 rounded">
            Reselect PDF
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
