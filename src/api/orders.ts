import apiClient from './client';

export interface Order {
  id: string;
  order_number: string;
  status: 'purchased' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  product_name: string;
  product_image: string;
  client_id: string;
  client_name: string;
  jastiper_id: string;
  price: number;
  estimated_arrival?: string;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const ordersApi = {
  getOrders: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<OrdersResponse> => {
    const response = await apiClient.get<OrdersResponse>('/v1/orders', {
      params,
    });
    return response.data;
  },
};
