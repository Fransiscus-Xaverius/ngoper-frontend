import apiClient from './client';

export interface PostCreator {
  id: string;
  email: string;
  name: string;
  avatar: string;
  location?: string;
  role: string;
}

export interface Post {
  id: string;
  user_id: string;
  type: 'trip' | 'product' | 'exclusive';
  content: string;
  images: string[];
  location?: string;
  price?: string;
  likes: number;
  comments: number;
  shares: number;
  isLive: boolean;
  isLocked: boolean;
  allow_requests: boolean;
  timestamp: string;
  updated_at?: string;
  creator?: PostCreator;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface FeedResponse {
  success: boolean;
  data: {
    posts: Post[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface CreatePostRequest {
  content: string;
  type: string;
  images: string[];
  location?: string;
  price?: string;
  allow_requests?: boolean;
}

export interface PostResponse {
  success: boolean;
  data: Post;
}

export interface ImageUploadResponse {
  success: boolean;
  url: string;
  thumbnailUrl?: string;
}

export interface LikeResponse {
  success: boolean;
  data: {
    likes: number;
  };
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${baseURL}${path}`;
}

function mapPost(post: Post): Post {
  return {
    ...post,
    images: (post.images || []).map(getImageUrl),
    creator: post.creator
      ? {
          ...post.creator,
          avatar: post.creator.avatar
            ? getImageUrl(post.creator.avatar)
            : post.creator.avatar,
        }
      : undefined,
  };
}

export const postsApi = {
  getFeed: async (params?: {
    page?: number;
    limit?: number;
    filter?: string;
    userId?: string;
  }): Promise<FeedResponse> => {
    const response = await apiClient.get<FeedResponse>('/v1/feed', { params });
    return {
      ...response.data,
      data: {
        posts: response.data.data.posts.map(mapPost),
      },
    };
  },

  createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
    const response = await apiClient.post<PostResponse>('/v1/posts', data);
    return {
      ...response.data,
      data: mapPost(response.data.data),
    };
  },

  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ImageUploadResponse>(
      '/v1/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  likePost: async (postId: string): Promise<LikeResponse> => {
    const response = await apiClient.post<LikeResponse>(
      `/v1/posts/${postId}/like`
    );
    return response.data;
  },

  unlikePost: async (postId: string): Promise<LikeResponse> => {
    const response = await apiClient.delete<LikeResponse>(
      `/v1/posts/${postId}/like`
    );
    return response.data;
  },

  bookmarkPost: async (postId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(
      `/v1/posts/${postId}/bookmark`
    );
    return response.data;
  },

  unbookmarkPost: async (postId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(
      `/v1/posts/${postId}/bookmark`
    );
    return response.data;
  },

  sharePost: async (postId: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(
      `/v1/posts/${postId}/share`
    );
    return response.data;
  },

  createRequest: async (
    postId: string,
    data: {
      description: string;
      images: string[];
      quantity: number;
      proposed_price?: number;
    }
  ): Promise<{ success: boolean; data: OrderRequest }> => {
    const response = await apiClient.post<{ success: boolean; data: OrderRequest }>(
      `/v1/posts/${postId}/request`,
      data
    );
    return response.data;
  },

  getRequests: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: { requests: OrderRequest[] };
    pagination: { page: number; limit: number; total: number; hasMore: boolean };
  }> => {
    const response = await apiClient.get('/v1/requests', { params });
    return response.data;
  },

  acceptRequest: async (
    requestId: string,
    data: { price: number; product_name?: string }
  ): Promise<{ success: boolean; data: { id: string; order_number: string; price: number } }> => {
    const response = await apiClient.post(`/v1/requests/${requestId}/accept`, data);
    return response.data;
  },

  rejectRequest: async (
    requestId: string
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/v1/requests/${requestId}/reject`);
    return response.data;
  },

  counterRequest: async (
    requestId: string,
    counterPrice: number
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(`/v1/requests/${requestId}/counter`, {
      counter_price: counterPrice,
    });
    return response.data;
  },

  getUserRequests: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    success: boolean;
    data: { requests: OrderRequest[] };
    pagination: { page: number; limit: number; total: number; hasMore: boolean };
  }> => {
    const response = await apiClient.get('/v1/my-requests', { params });
    return response.data;
  },

  getNotifications: async (): Promise<{
    notifications: Array<{
      id: string;
      type: string;
      message: string;
      read: boolean;
      created_at: string;
    }>;
    unread: number;
  }> => {
    const response = await apiClient.get('/v1/notifications');
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unread: number }> => {
    const response = await apiClient.get('/v1/notifications/unread-count');
    return response.data;
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await apiClient.post(`/v1/notifications/${id}/read`);
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.post('/v1/notifications/read-all');
  },
};

export interface OrderRequest {
  id: string;
  post_id: string;
  requester_id: string;
  jastiper_id: string;
  description: string;
  images: string[];
  quantity: number;
  status: 'pending' | 'countered' | 'accepted' | 'rejected';
  proposed_price?: number;
  counter_price?: number;
  price?: number;
  product_name?: string;
  created_at: string;
  updated_at: string;
  requester?: PostCreator;
}
