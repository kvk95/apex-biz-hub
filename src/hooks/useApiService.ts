import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse } from '@/services/ApiService';

interface UseApiServiceOptions {
  autoFetch?: boolean;
}

export function useApiService<T>(
  endpoint: string,
  options: UseApiServiceOptions = { autoFetch: true }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<T> = await apiService.get<T>(endpoint);
      
      if (response.status.code === 'S') {
        setData(response.result);
      } else if (response.status.code === 'N') {
        setData(null);
        setError('No data found');
      } else {
        setError(response.status.description || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const postData = useCallback(async (postData: unknown) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<T> = await apiService.post<T>(endpoint, postData);
      
      if (response.status.code === 'S') {
        return { success: true, data: response.result };
      } else {
        setError(response.status.description || 'Failed to post data');
        return { success: false, error: response.status.description };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const updateData = useCallback(async (updatePayload: unknown) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<T> = await apiService.put<T>(endpoint, updatePayload);
      
      if (response.status.code === 'S') {
        return { success: true, data: response.result };
      } else {
        setError(response.status.description || 'Failed to update data');
        return { success: false, error: response.status.description };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const deleteData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<T> = await apiService.delete<T>(endpoint);
      
      if (response.status.code === 'S') {
        return { success: true };
      } else {
        setError(response.status.description || 'Failed to delete data');
        return { success: false, error: response.status.description };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    if (options.autoFetch) {
      fetchData();
    }
  }, [fetchData, options.autoFetch]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    post: postData,
    update: updateData,
    delete: deleteData
  };
}
