import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => { 
    // Read the flag before clearing storage
    const showMessage = localStorage.getItem("show_invalid_session_message");
    const show401Message = localStorage.getItem("show_401_session_message");

    // Clear all session and local storage
    sessionStorage.clear();
    localStorage.clear();

    // Restore the flag if it existed
    if (showMessage) {
      localStorage.setItem("show_invalid_session_message", showMessage);
    }
    if (show401Message) {
      localStorage.setItem("show_401_session_message", show401Message);
    }

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
