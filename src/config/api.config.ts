export const API_CONFIG = {
  // Switch between 'local' (JSON files) and 'remote' (Flask API)
  dataSource: 'local' as 'local' | 'remote',
  
  // Remote API configuration (for future Flask integration)
  remoteApi: {
    baseUrl: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    }
  },
  
  // Local data paths
  localDataPath: '/data/api'
};
