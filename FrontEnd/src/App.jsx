import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import PdfView from './PdfView';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PublicRoute from './components/PublicRoute';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf-view/:objectId" element={<PdfView />} />
        <Route path="/signup" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
        />

        {/* <Route path="signup" element={<RegisterPage/>}/> */}
        {/* <Route path="login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
