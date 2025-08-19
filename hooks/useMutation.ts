import { useMutation } from '@tanstack/react-query';
import api from '../service/api';

interface UseApiMutationProps<TData> {
  url: string;
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  onSuccess?: (data: any | TData) => void;
  onError?: (error: unknown) => void;
  isFormData?: boolean;
}

const useApiMutation = <TData extends Record<string, any> = Record<string, any>>({
  url,
  method = 'POST',
  onSuccess,
  onError,
  isFormData = false,
}: UseApiMutationProps<TData>) => {
  const mutation = useMutation<any, unknown, TData>({
    mutationFn: async (data: TData) => {
      if (method === 'DELETE') {
        const id = (data as any)?.id;
        if (!id) throw new Error('ID required for DELETE request');
        const response = await api.delete(`${url}/${id}`);
        return response.data;
      }

      let requestData: any = data;
      const headers: Record<string, string> = {};

      if (isFormData) {
        headers['Content-Type'] = 'multipart/form-data';
      }

      const response = await api({
        url,
        method,
        data: requestData,
        headers,
      });

      return response.data;
    },
    onSuccess,
    onError,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useApiMutation;
