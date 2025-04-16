import { useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/user/user.slice"; 
import { showToast } from "@/Helper/ShowToast";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/api/user/logout`, {
        method: 'POST',  
        credentials: 'include',
      });
  
      if (resp.ok) {
        dispatch(logout()); 
        
        showToast('success', "Logout successful!", 0,1000);  
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showToast('error', "Logout failed! Please try again."); 
      }
    } catch (error) {
      // console.error('Logout error:', error);
      showToast('error', "Logout failed! Please try again.", 0);
    }
  };
  

  return (
    <header className="w-full bg-white shadow-lg px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 transition-colors duration-200 hover:text-blue-800"
        >
          InShare
        </Link>

        <nav className="hidden md:flex space-x-4">
          {user.isLoggedIn ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="transition-all duration-200 hover:shadow-md border-red-500 text-red-500 hover:shadow-red-500"
            >
              Logout
            </Button>
          ) : (
            <Link to="/signup">
              <Button
                variant="outline"
                className="transition-all duration-200 hover:shadow-md hover:shadow-blue-600 border-blue-600"
              >
                Sign Up / Login
              </Button>
            </Link>
          )}
        </nav>

        <button
          className="md:hidden text-gray-700 hover:text-black transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-2 px-4">
          {user.isLoggedIn ? (
            <Button
              variant="outline"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full border-red-500 text-red-500 hover:shadow-md"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link to="/signup" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full transition-all duration-200 hover:shadow-md"
                >
                  Sign Up
                </Button>
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full transition-all duration-200 hover:shadow-md">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
