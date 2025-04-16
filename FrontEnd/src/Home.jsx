import { useState } from 'react';
import { useSelector } from 'react-redux';
import ActiveLinks from './components/ActiveLinks';
import Header from './components/Header';
import Uploader from './components/Uploader';

function Home() {
  const [upload, setUpload] = useState(null);
  const user = useSelector((state) => state.user);

  const handleUploadSuccess = () => {
    // Toggle the upload state (force re-fetch in ActiveLinks)
    setUpload(prev => !prev);
  };

  return (
    <div className="main w-screen h-screen font-[system-ui] bg-[#eff5fe] flex flex-col">
      <Header />
      <Uploader onUploadSuccess={handleUploadSuccess} />
      <ActiveLinks upload={upload} userId={user.user._id} />
    </div>
  );
}

export default Home;
