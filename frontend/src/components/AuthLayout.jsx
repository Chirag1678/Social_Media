import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useSelector((state) => state.auth.status === true);

  useEffect(() => {
    const handleRedirect = () => {
      if (authentication && !isAuthenticated) {
        navigate("/login");
      } else if (!authentication && isAuthenticated) {
        navigate("/");
      } else {
        setLoading(false);
      }
    };
    handleRedirect();
  }, [isAuthenticated, authentication, navigate]);

  // Show a loader while checking the authentication status
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return <>{children}</>;
}