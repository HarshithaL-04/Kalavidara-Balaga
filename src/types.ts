export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'performer' | 'admin';
  displayName: string;
  photoURL?: string;
  createdAt?: string;
}

export interface PerformerProfile {
  uid: string;
  groupName: string;
  leaderName: string;
  phone: string;
  district: string;
  artForm: string;
  experience: string;
  price: number;
  description: string;
  photoUrl: string;
  gallery: string[];
  videos: string[];
  isApproved: boolean;
  rating: number;
  reviewCount: number;
  availability: string[];
  equipment: string[];
}

export interface Booking {
  id: string;
  performerId: string;
  userId: string;
  eventDate: string;
  location: string;
  details: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  priceAtBooking: number;
}

export interface Review {
  id: string;
  bookingId: string;
  performerId: string;
  userId: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}
