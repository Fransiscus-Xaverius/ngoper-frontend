import apiClient from './client';

export interface ItineraryItem {
  place_name: string;
  location: string;
  time: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  destination_country: string;
  poster: string;
  start_date: string;
  end_date: string;
  local_delivery_date: string;
  origin_city: string;
  itinerary: ItineraryItem[];
  cities_visited: string[];
  catalog_item_ids: string[];
  jastiper_id: string;
  jastiper_name: string;
  jastiper_avatar: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  available_slots: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateTripRequest {
  title: string;
  description: string;
  destination_country: string;
  poster: string;
  start_date: string;
  end_date: string;
  local_delivery_date: string;
  origin_city: string;
  itinerary: ItineraryItem[];
  cities_visited?: string[];
  catalog_item_ids?: string[];
}

export interface TripRequest {
  id: string;
  trip_id: string;
  requester_id: string;
  requester_name: string;
  requester_avatar: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  items_description?: string;
  created_at: string;
}

export interface CreateTripRequestPayload {
  message: string;
  items_description?: string;
}

export interface TripsResponse {
  success: boolean;
  data: {
    trips: Trip[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface TripResponse {
  success: boolean;
  data: Trip;
}

export interface TripRequestsResponse {
  success: boolean;
  data: {
    requests: TripRequest[];
  };
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${baseURL}${path}`;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const tripsApi = {
  createTrip: async (data: CreateTripRequest, posterFile?: File | null): Promise<TripResponse> => {
    let poster = data.poster;
    if (posterFile) {
      const formData = new FormData();
      formData.append('file', posterFile);
      const uploadRes = await apiClient.post<{ success: boolean; url: string }>('/v1/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (uploadRes.data.url) {
        poster = uploadRes.data.url;
      }
    }

    const response = await apiClient.post<{ success: boolean; data: Trip }>('/v1/trips', {
      ...data,
      poster,
    });

    return {
      success: response.data.success,
      data: response.data.data,
    };
  },

  getTrips: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<TripsResponse> => {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const res = await apiClient.get<TripsResponse>('/v1/trips', {
      params: { page, limit, status: params?.status },
    });
    return {
      success: true,
      data: { trips: res.data.data?.trips || [] },
      pagination: res.data.pagination || { page, limit, total: 0, hasMore: false },
    };
  },

  getTrip: async (tripId: string): Promise<TripResponse> => {
    const res = await apiClient.get<TripResponse>(`/v1/trips/${tripId}`);
    return res.data;
  },

  updateTripStatus: async (tripId: string, status: string): Promise<TripResponse> => {
    const res = await apiClient.put<TripResponse>(`/v1/trips/${tripId}/status`, { status });
    return res.data;
  },

  requestToJoin: async (tripId: string, reqData: CreateTripRequestPayload): Promise<{ success: boolean; data: TripRequest }> => {
    const newReq: TripRequest = {
      id: `req_${uid()}`,
      trip_id: tripId,
      requester_id: 'buyer_01',
      requester_name: 'Budi Santoso',
      requester_avatar: '',
      message: reqData.message,
      items_description: reqData.items_description,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    return { success: true, data: newReq };
  },

  getTripRequests: async (tripId: string): Promise<TripRequestsResponse> => {
    return {
      success: true,
      data: { requests: [] },
    };
  },

  respondToRequest: async (
    requestId: string,
    action: 'accepted' | 'rejected'
  ): Promise<{ success: boolean }> => {
    return { success: true };
  },
};
