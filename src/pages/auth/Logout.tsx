import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all session and local storage
    sessionStorage.clear();
    localStorage.clear();
    
    // Redirect to login
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <i className="fa fa-spinner fa-spin text-4xl text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Logging out...</p>
      </div>
    </div>
  );
}
