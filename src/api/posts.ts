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
};
