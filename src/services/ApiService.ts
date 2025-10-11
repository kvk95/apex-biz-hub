import { API_CONFIG } from '@/config/api.config';

export interface ApiResponse<T> {
  status: {
    code: 'S' | 'N' | 'F';
    description: string;
  };
  result: T;
}

 

class ApiService {

  // Method to handle authorization header
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken'); // Assuming token is stored in localStorage
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async fetchFromLocal<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_CONFIG.localDataPath}/${endpoint}.json`);
      
      if (!response.ok) {
        return {
          status: {
            code: 'N',
            description: 'Data not found'
          },
          result: [] as T
        };
      }
      
     
      const data = await response.json();
      // Check for status after data retrieval
      // if (data.status?.code !== 'S') {
      //   return {
      //     status: {
      //       code: 'F',
      //       description: `Failed to fetch data: ${data.status?.description}`,
      //     },
      //     result: [] as T,
      //   };
      // }
      

      return data;
    } catch (error) {
      console.error(`Error fetching local data from ${endpoint}:`, error);
      return {
        status: {
          code: 'F',
          description: error instanceof Error ? error.message : 'Failed to fetch data'
        },
        result: [] as T
      };
    }
  }

  private async fetchFromRemote<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
       const response = await fetch(`${API_CONFIG.remoteApi.baseUrl}/${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(API_CONFIG.remoteApi.timeout),
      });

      if (!response.ok) {
        return {
          status: {
            code: 'F',
            description: `HTTP ${response.status}: ${response.statusText}`
          },
          result: [] as T
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching remote data from ${endpoint}:`, error);
      return {
        status: {
          code: 'F',
          description: error instanceof Error ? error.message : 'Failed to fetch data'
        },
        result: [] as T
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    if (API_CONFIG.dataSource === 'local') {
      return this.fetchFromLocal<T>(endpoint);
    } else {
      return this.fetchFromRemote<T>(endpoint);
    }
  }

  async post<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    if (API_CONFIG.dataSource === 'local') {
      // For local mode, simulate a successful post
      console.log('Local mode: POST simulation', endpoint, data);
      return {
        status: {
          code: 'S',
          description: 'Success (simulated)'
        },
        result: data as T
      };
    } else {
      try {
        const response = await fetch(`${API_CONFIG.remoteApi.baseUrl}/${endpoint}`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(API_CONFIG.remoteApi.timeout)
        });

        if (!response.ok) {
          return {
            status: {
              code: 'F',
              description: `HTTP ${response.status}: ${response.statusText}`
            },
            result: {} as T
          };
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        return {
          status: {
            code: 'F',
            description: error instanceof Error ? error.message : 'Failed to post data'
          },
          result: {} as T
        };
      }
    }
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    if (API_CONFIG.dataSource === 'local') {
      console.log('Local mode: PUT simulation', endpoint, data);
      return {
        status: {
          code: 'S',
          description: 'Success (simulated)'
        },
        result: data as T
      };
    } else {
      try {
        const response = await fetch(`${API_CONFIG.remoteApi.baseUrl}/${endpoint}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
          signal: AbortSignal.timeout(API_CONFIG.remoteApi.timeout)
        });

        if (!response.ok) {
          return {
            status: {
              code: 'F',
              description: `HTTP ${response.status}: ${response.statusText}`
            },
            result: {} as T
          };
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error(`Error updating ${endpoint}:`, error);
        return {
          status: {
            code: 'F',
            description: error instanceof Error ? error.message : 'Failed to update data'
          },
          result: {} as T
        };
      }
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    if (API_CONFIG.dataSource === 'local') {
      console.log('Local mode: DELETE simulation', endpoint);
      return {
        status: {
          code: 'S',
          description: 'Success (simulated)'
        },
        result: {} as T
      };
    } else {
      try {
        const response = await fetch(`${API_CONFIG.remoteApi.baseUrl}/${endpoint}`, {
          method: 'DELETE',
         headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(API_CONFIG.remoteApi.timeout)
        });

        if (!response.ok) {
          return {
            status: {
              code: 'F',
              description: `HTTP ${response.status}: ${response.statusText}`
            },
            result: {} as T
          };
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        return {
          status: {
            code: 'F',
            description: error instanceof Error ? error.message : 'Failed to delete data'
          },
          result: {} as T
        };
      }
    }
  }
}

export const apiService = new ApiService();
