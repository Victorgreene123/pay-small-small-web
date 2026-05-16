export interface User {
  id: string;
  email: string;
  name: string;

  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
 name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Participant {
  id: string;
  name: string;
  contact?: string;
  role: 'OBLIGATED' | 'CONTRIBUTOR';
  amountToPay?: number;
  amountPaid: number;
}

export interface Split {
  id: string;
  title: string;
  description?: string;
  totalAmount: number | null;
  splitType: 'FIXED' | 'SLOT_BASED' | 'OPEN';
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  shareCode: string;
  numberOfSlots?: number | null;
  amountPerSlot?: number | null;
  minimumAmount?: number | null;
  wallet?: {
    balance: number;
  };
  participants: Participant[];
  _count?: {
    participants: number;
  };
  trustScore?: number;
  riskFlag?: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
