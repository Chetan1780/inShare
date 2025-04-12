import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PdfView from './PdfView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf-view/:objectId" element={<PdfView />} />
      </Routes>
    </Router>
  );
}

export default App;
