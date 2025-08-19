import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosRequestConfig, AxiosError } from 'axios';
import api from '../service/api';

// API'dan qaytadigan umumiy shakl
interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// useFetch parametrlarini aniqlaymiz
interface UseFetchProps<T> {
  key: string | (string | number)[];
  url: string;
  config?: AxiosRequestConfig;
  options?: Omit<UseQueryOptions<{ items: T[]; total: number }, AxiosError>, 'queryKey' | 'queryFn'>;
}

// Hook
export const useFetch = <T = unknown>({
  key,
  url,
  config,
  options,
}: UseFetchProps<T>) => {
  const query = useQuery<{ items: T[]; total: number }, AxiosError>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await api.get<{ data: ApiResponse<T> }>(url, config);

      return {
        items: response?.data?.data?.items,
        total: response.data.data.total,
      };
    },
    ...options,
  });

  return {
    data: query.data,          // data?.items, data?.total
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
    error: query.error,
    refetch: query.refetch,
  };
};
