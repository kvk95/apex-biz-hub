export const API_CONFIG = {

  appsName: "POS",

  // Switch between 'local' (JSON files) and 'remote' (Flask API)
  dataSource: "local" as "local" | "remote",

  // Remote API configuration (for future Flask integration)
  remoteApi: {
    baseUrl: "http://127.0.0.1:5000/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  },

  // Local data paths
  localDataPath: "/data/api",

  // Error handling configuration
  showDetailedErrors: true, // Set to false in production

  // Toast configuration
  toast: {
    successDuration: 3000, // 3 seconds
    errorDuration: 5000, // 5 seconds for errors
    infoDuration: 3000, // 3 seconds
  },

  // Pagination configuration
  pagination: {
    defaultRecordsPerPage: 10, // Default records per page for grids
  },
};
