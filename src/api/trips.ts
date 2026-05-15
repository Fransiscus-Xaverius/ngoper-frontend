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

const dummyTrips: Trip[] = [
  {
    id: 'trip_01',
    title: 'Tokyo Spring Haul 2026',
    description: 'Hunting the best skincare, snacks, and exclusive anime merch across Tokyo. Open for requests!',
    destination_country: 'Japan',
    poster: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    start_date: '2026-06-15',
    end_date: '2026-06-28',
    local_delivery_date: '2026-07-05',
    origin_city: 'Jakarta',
    itinerary: [
      { place_name: 'Shibuya Crossing & Shopping', location: 'Tokyo', time: '15 Jun 09:00' },
      { place_name: 'Akihabara Electronic Town', location: 'Tokyo', time: '17 Jun 10:00' },
      { place_name: 'Ginza Luxury District', location: 'Tokyo', time: '19 Jun 11:00' },
      { place_name: 'Osaka Dotonbori', location: 'Osaka', time: '22 Jun 14:00' },
      { place_name: 'Kyoto Arashiyama Bamboo Grove', location: 'Kyoto', time: '25 Jun 08:00' },
    ],
    cities_visited: ['Tokyo', 'Osaka', 'Kyoto', 'Sapporo'],
    catalog_item_ids: [],
    jastiper_id: 'jastiper_01',
    jastiper_name: 'Kenji Nakamura',
    jastiper_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    status: 'upcoming',
    available_slots: 8,
    created_at: '2026-05-01T08:00:00Z',
  },
  {
    id: 'trip_02',
    title: 'Seoul K-Beauty & Streetwear',
    description: 'Grabbing the latest K-beauty products and streetwear from Seoul. Limited slots available!',
    destination_country: 'South Korea',
    poster: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
    start_date: '2026-07-10',
    end_date: '2026-07-20',
    local_delivery_date: '2026-07-28',
    origin_city: 'Jakarta',
    itinerary: [
      { place_name: 'Myeongdong Shopping District', location: 'Seoul', time: '10 Jul 10:00' },
      { place_name: 'Hongdae Streetwear Shops', location: 'Seoul', time: '12 Jul 13:00' },
      { place_name: 'Gangnam K-Beauty Stores', location: 'Seoul', time: '15 Jul 09:00' },
      { place_name: 'Incheon Duty Free', location: 'Incheon', time: '18 Jul 14:00' },
    ],
    cities_visited: ['Seoul', 'Incheon', 'Busan'],
    catalog_item_ids: [],
    jastiper_id: 'jastiper_02',
    jastiper_name: 'Minji Kim',
    jastiper_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    status: 'upcoming',
    available_slots: 5,
    created_at: '2026-05-10T10:00:00Z',
  },
  {
    id: 'trip_03',
    title: 'Bangkok Street Food & Snacks',
    description: 'Exploring Bangkok for the best snacks, spices, and unique finds. Open for jastip requests!',
    destination_country: 'Thailand',
    poster: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
    start_date: '2026-05-20',
    end_date: '2026-05-27',
    local_delivery_date: '2026-06-03',
    origin_city: 'Medan',
    itinerary: [
      { place_name: 'Chatuchak Weekend Market', location: 'Bangkok', time: '20 May 08:00' },
      { place_name: 'Siam Paragon Shopping', location: 'Bangkok', time: '22 May 10:00' },
      { place_name: 'Yaowarat Chinatown Food', location: 'Bangkok', time: '24 May 18:00' },
    ],
    cities_visited: ['Bangkok', 'Pattaya'],
    catalog_item_ids: [],
    jastiper_id: 'jastiper_03',
    jastiper_name: 'Siti Rahayu',
    jastiper_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    status: 'ongoing',
    available_slots: 3,
    created_at: '2026-04-15T06:00:00Z',
  },
  {
    id: 'trip_04',
    title: 'Singapore Limited Edition Hunt',
    description: 'Hunting limited edition sneakers, electronics, and luxury goods in Singapore.',
    destination_country: 'Singapore',
    poster: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
    start_date: '2026-04-01',
    end_date: '2026-04-08',
    local_delivery_date: '2026-04-15',
    origin_city: 'Jakarta',
    itinerary: [
      { place_name: 'Orchard Road Shopping', location: 'Singapore', time: '1 Apr 10:00' },
      { place_name: 'Marina Bay Sands Retail', location: 'Singapore', time: '3 Apr 11:00' },
      { place_name: 'Bugis Street Market', location: 'Singapore', time: '5 Apr 14:00' },
    ],
    cities_visited: ['Singapore'],
    catalog_item_ids: [],
    jastiper_id: 'jastiper_01',
    jastiper_name: 'Kenji Nakamura',
    jastiper_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    status: 'completed',
    available_slots: 0,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'trip_05',
    title: 'Paris Fashion & Fragrances',
    description: 'Bringing back the finest French fragrances, designer fashion, and gourmet chocolates.',
    destination_country: 'France',
    poster: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    start_date: '2026-08-05',
    end_date: '2026-08-18',
    local_delivery_date: '2026-08-25',
    origin_city: 'Surabaya',
    itinerary: [
      { place_name: 'Champs-Élysées Boutiques', location: 'Paris', time: '6 Aug 10:00' },
      { place_name: 'Le Marais Vintage Shops', location: 'Paris', time: '9 Aug 11:00' },
      { place_name: 'Galeries Lafayette', location: 'Paris', time: '12 Aug 09:00' },
      { place_name: 'Provence Lavender Market', location: 'Provence', time: '15 Aug 08:00' },
    ],
    cities_visited: ['Paris', 'Provence', 'Lyon'],
    catalog_item_ids: [],
    jastiper_id: 'jastiper_04',
    jastiper_name: 'Pierre Dubois',
    jastiper_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    status: 'upcoming',
    available_slots: 10,
    created_at: '2026-06-01T12:00:00Z',
  },
];

const mockRequests: TripRequest[] = [];

export const tripsApi = {
  getTrips: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<TripsResponse> => {
    let filtered = dummyTrips;
    if (params?.status && params.status !== 'all') {
      filtered = dummyTrips.filter((t) => t.status === params.status);
    }
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    return {
      success: true,
      data: { trips: paged },
      pagination: {
        page,
        limit,
        total: filtered.length,
        hasMore: start + limit < filtered.length,
      },
    };
  },

  getMyTrips: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<TripsResponse> => {
    let filtered = dummyTrips.filter((t) => t.jastiper_id === 'jastiper_01');
    if (params?.status && params.status !== 'all') {
      filtered = filtered.filter((t) => t.status === params.status);
    }
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);
    return {
      success: true,
      data: { trips: paged },
      pagination: {
        page,
        limit,
        total: filtered.length,
        hasMore: start + limit < filtered.length,
      },
    };
  },

  getTrip: async (tripId: string): Promise<TripResponse> => {
    const trip = dummyTrips.find((t) => t.id === tripId);
    if (!trip) {
      return { success: false, data: null as unknown as Trip };
    }
    return { success: true, data: trip };
  },

  createTrip: async (data: CreateTripRequest): Promise<TripResponse> => {
    const newTrip: Trip = {
      id: `trip_${uid()}`,
      title: data.title,
      description: data.description,
      destination_country: data.destination_country,
      poster: data.poster || '',
      start_date: data.start_date,
      end_date: data.end_date,
      local_delivery_date: data.local_delivery_date,
      origin_city: data.origin_city,
      itinerary: data.itinerary,
      cities_visited: data.cities_visited || [],
      catalog_item_ids: data.catalog_item_ids || [],
      jastiper_id: 'jastiper_01',
      jastiper_name: 'Kenji Nakamura',
      jastiper_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      status: 'upcoming',
      available_slots: 10,
      created_at: new Date().toISOString(),
    };
    dummyTrips.unshift(newTrip);
    return { success: true, data: newTrip };
  },

  updateTrip: async (tripId: string, data: Partial<CreateTripRequest>): Promise<TripResponse> => {
    const idx = dummyTrips.findIndex((t) => t.id === tripId);
    if (idx === -1) {
      return { success: false, data: null as unknown as Trip };
    }
    dummyTrips[idx] = { ...dummyTrips[idx], ...data, updated_at: new Date().toISOString() };
    return { success: true, data: dummyTrips[idx] };
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
    mockRequests.push(newReq);
    return { success: true, data: newReq };
  },

  getTripRequests: async (tripId: string): Promise<TripRequestsResponse> => {
    const filtered = mockRequests.filter((r) => r.trip_id === tripId);
    return {
      success: true,
      data: { requests: filtered },
    };
  },

  respondToRequest: async (
    requestId: string,
    action: 'accepted' | 'rejected'
  ): Promise<{ success: boolean }> => {
    const req = mockRequests.find((r) => r.id === requestId);
    if (req) req.status = action;
    return { success: true };
  },
};
