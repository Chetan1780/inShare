// components/PublicRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user && user.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PublicRoute;
