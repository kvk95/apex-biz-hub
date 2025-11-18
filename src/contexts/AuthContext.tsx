import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,useCallback,
} from "react";
import { API_CONFIG } from "@/config/api.config";

// Define user type
type User = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

// Define Application settings type
type AppsSettings = {
  currency: string;
  timezone: string;
};

// Define tokens type
type Tokens = {
  access_token: string;
  refresh_token: string;
};

// Define context type
type AuthContextType = {
  user: User | null;
  appsSettings: AppsSettings | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  clearTokens: () => void;
  handleUnauthorized: () => void;
  fetchAppsSettings: () => Promise<void>;
  ensureSettingsLoaded: () => Promise<void>;
  validateToken: () => boolean;
  apiCall: <T = any>(endpoint: string, options?: RequestInit) => Promise<T>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appsSettings, setAppsSettings] = useState<AppsSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // local storage keys config
  const LS_KEY_ACCESS_TOKEN = "-nb-db-at-";
  const LS_KEY_REFRESH_TOKEN = "-nb-db-rt-";
  const LS_KEY_USER = "-nb-db-usr-";
  const LS_KEY_APPS_SETTINGS = "-nb-db-apps-";

  // Handle unauthorized access (401 errors)
  const handleUnauthorized = () => {
    console.log("Unauthorized access detected, redirecting to logout page");
    setUser(null);
    setAppsSettings(null);
    localStorage.setItem("show_401_session_message", "true");
    window.location.href = "/logout";
  };

  // Validate token exists in localStorage
  const validateToken = (): boolean => {
    const token = localStorage.getItem(LS_KEY_ACCESS_TOKEN);
    if (!token) {
      console.log(
        "No access token found in localStorage - unauthorized access"
      );
      handleUnauthorized();
      return false;
    }
    return true;
  };

  // Clear tokens and all user data from localStorage
  const clearTokens = () => {
    console.log("Clearing all tokens and user data from localStorage");

    // Clear all possible localStorage keys
    const keysToRemove = [
      LS_KEY_ACCESS_TOKEN,
      LS_KEY_REFRESH_TOKEN,
      LS_KEY_USER,
      LS_KEY_APPS_SETTINGS,
      // Also clear any legacy keys that might exist
      "access_token",
      "refresh_token",
      "user",
      "apps_settings",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    // For extra safety, clear all localStorage items that contain our app's identifiers
    Object.keys(localStorage).forEach((key) => {
      if (
        key.includes("-nb-db-") ||
        key.includes("apps") ||
        key.includes("auth")
      ) {
        localStorage.removeItem(key);
      }
    });
  };

  // Get access token
  const getAccessToken = (): string | null => {
    return localStorage.getItem(LS_KEY_ACCESS_TOKEN);
  };

  // Get refresh token
  const getRefreshToken = (): string | null => {
    return localStorage.getItem(LS_KEY_REFRESH_TOKEN);
  };

  // Set tokens
  const setTokens = (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(LS_KEY_ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(LS_KEY_REFRESH_TOKEN, refreshToken);
    }
  };

  // Get auth headers helper
  const getAuthHeaders = () => {
    const token = getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Check if endpoint requires authentication
  const requiresAuth = (endpoint: string): boolean => {
    return (
      !endpoint.startsWith("/oauth/") && !endpoint.startsWith("/anonymous/")
    );
  };

  // Handle API errors
  const handleApiError = async (response: Response) => {
    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    // Handle 422 error with "Subject must be a string" - indicates invalid JWT token
    if (response.status === 422) {
      try {
        const errorData = await response.json();
        if (errorData.msg === "Subject must be a string") {
          console.log(
            "Invalid JWT token detected (422 error) - logging out user"
          );
          handleInvalidSession();
          return;
        }
      } catch (e) {
        // If we can't parse the JSON, fall through to regular error handling
      }
    }

    const errorText = await response.text();
    throw new Error(
      `API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  };

  // Handle invalid session (422 error with Subject must be a string)
  const handleInvalidSession = () => {
    console.log(
      "Invalid session detected - clearing tokens and redirecting to login"
    );
    clearTokens();
    setUser(null);
    setAppsSettings(null);

    // Store a flag to show invalid session message on login page
    localStorage.setItem("show_invalid_session_message", "true");

    window.location.href = "/login";
  };

  // Generic, typed, reusable API call
  const apiCall = useCallback(
    async <T = any,>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> => {
      if (requiresAuth(endpoint) && !validateToken()) {
        throw new Error("No valid token");
      }

      const response = await fetch(
        `${API_CONFIG.remoteApi.baseUrl}${endpoint}`,
        {
          headers: requiresAuth(endpoint)
            ? getAuthHeaders()
            : { "Content-Type": "application/json" },
          ...options,
        }
      );

      if (!response.ok) {
        await handleApiError(response); 
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) return {} as T;

      return response.json();
    },
    [] // dependencies
  );

  // Logout function
  const logout = () => {
    console.log("Logging out user - redirecting to logout page");

    // Read the flag before clearing storage
    const showMessage = localStorage.getItem("show_invalid_session_message");

    setUser(null);
    setAppsSettings(null);
    clearTokens(); // Clear settings data on logout

    // Restore the flag if it existed
    if (showMessage) {
      localStorage.setItem("show_invalid_session_message", showMessage);
    }

    window.location.href = "/logout";
  };

  // Login function using the new API format
  const login = async (email: string, password: string) => {
    const data = await apiCall("/oauth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.status.code !== "S") {
      throw new Error(data.status.description || "Login failed");
    }

    // Store tokens and user data
    const { access_token, refresh_token, user_details } = data.result;

    localStorage.setItem(LS_KEY_ACCESS_TOKEN, access_token);
    localStorage.setItem(LS_KEY_REFRESH_TOKEN, refresh_token);
    localStorage.setItem(LS_KEY_USER, JSON.stringify(user_details));

    setUser(user_details);

    // Fetch apps settings after successful login
    await fetchAppsSettings();
  };

  // Fetch apps settings
  const fetchAppsSettings = async () => {
    try {
      const data = await apiCall("/settings/apps/get");
      if (data.status.code === "S") {
        setAppsSettings(data.result);
        localStorage.setItem(LS_KEY_APPS_SETTINGS, JSON.stringify(data.result));
        // Update document title with apps name
        //document.title = `${data.result.company_name || API_CONFIG.appsName} Dashboard`;
      }
    } catch (err) {
      console.error("Error fetching apps settings:", err);
    }
  };

  // Fetch apps settings using public API (no auth required)
  const fetchAppsSettingsPublic = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.remoteApi.baseUrl}/settings/apps/get`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        console.error("Error fetching apps settings:", response.statusText);
        return;
      }

      const data = await response.json();
      if (data.status.code === "S") {
        setAppsSettings(data.result);
        localStorage.setItem(LS_KEY_APPS_SETTINGS, JSON.stringify(data.result));
        // Update document title with apps name
        //document.title = `${data.result.company_name || API_CONFIG.appsName} Dashboard`;
      }
    } catch (err) {
      console.error("Error fetching apps settings:", err);
    }
  };

  // Function to ensure settings are loaded on any page
  const ensureSettingsLoaded = async () => {
    const storedAppsSettings = localStorage.getItem(LS_KEY_APPS_SETTINGS);
    if (!storedAppsSettings) {
      // Use public API if no auth token, otherwise use authenticated API
      if (getAccessToken()) {
        await fetchAppsSettings();
      } else {
        await fetchAppsSettingsPublic();
      }
    } else {
      // Load settings from localStorage if available
      try {
        const settings = JSON.parse(storedAppsSettings);
        setAppsSettings(settings);
        document.title = `${
          settings.apps_name || API_CONFIG.appsName
        } Dashboard`;
      } catch (err) {
        console.error("Error parsing stored apps settings:", err);
        // If parsing fails, fetch fresh settings
        if (getAccessToken()) {
          await fetchAppsSettings();
        } else {
          await fetchAppsSettingsPublic();
        }
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        appsSettings,
        loading,
        login,
        logout,
        getAccessToken,
        getRefreshToken,
        setTokens,
        clearTokens,
        handleUnauthorized,
        fetchAppsSettings,
        ensureSettingsLoaded,
        validateToken,
        apiCall,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
