import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PDFViewer() {
  const { objectId } = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);


  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-col items-center justify-center p-1 space-y-4">
      <iframe
  src={`http://localhost:3000/api/files/serve/${objectId}`}
  title="Secure PDF"
  width="90%"
  height="90%"
  className="shadow-lg border rounded"
/>

    </div>
  );
}

export default PDFViewer;
