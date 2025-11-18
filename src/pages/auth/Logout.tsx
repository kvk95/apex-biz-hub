// Logout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Read flags BEFORE clearing anything
    const invalidSessionFlag = localStorage.getItem(
      "show_invalid_session_message"
    );
    const unauthorizedFlag = localStorage.getItem("show_401_session_message");

    // 2. Clear ONLY auth-related data (never clear entire localStorage!)
    const keysToRemove = [
      "-nb-db-at-",
      "-nb-db-rt-",
      "-nb-db-usr-",
      "-nb-db-apps-",
      "access_token",
      "refresh_token",
      "user",
      "apps_settings",
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Optional: clear sessionStorage if you use it
    sessionStorage.clear();

    // 3. Restore the message flags so LoginPage can show them
    if (invalidSessionFlag === "true") {
      localStorage.setItem("show_invalid_session_message", "true");
    }
    if (unauthorizedFlag === "true") {
      localStorage.setItem("show_401_session_message", "true");
    }

    // 4. Redirect
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
