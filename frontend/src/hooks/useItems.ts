import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export type ItemStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Item {
  id: number;
  title: string;
  description: string | null;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ItemCreate {
  title: string;
  description?: string;
  status?: ItemStatus;
}

export interface ItemUpdate {
  title?: string;
  description?: string;
  status?: ItemStatus;
  is_deleted?: boolean;
}

export const useInfiniteItems = (status?: ItemStatus, includeDeleted: boolean = false) => {
  return useInfiniteQuery({
    queryKey: ['items', status, includeDeleted],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiClient.get<Item[]>('/items/', {
        params: {
          offset: pageParam,
          limit: 10,
          status: status || undefined,
          include_deleted: includeDeleted,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
    initialPageParam: 0,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: ItemCreate) => {
      const response = await apiClient.post<Item>('/items/', newItem);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ItemUpdate }) => {
      const response = await apiClient.patch<Item>(`/items/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useSoftDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete<Item>(`/items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useRestoreItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.patch<Item>(`/items/${id}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const usePermanentDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/items/${id}/permanent`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useBulkSoftDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await apiClient.delete('/items/', { data: ids });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useBulkPermanentDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await apiClient.delete('/items/bulk/permanent', { data: ids });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
