


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { field: string; message: string }[];
  count?: number;
  pagination?: { total: number; page: number; limit: number; pages: number };
}




export type UserRole = "admin" | "editor" | "pending";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}




export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  education: string;
  bio?: string;
  photoUrl?: string;
  isLeadership?: boolean;
  order?: number;
  socialLinks?: { linkedin?: string; github?: string; twitter?: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TeamMemberFormData = Omit<TeamMember, "_id" | "isActive" | "createdAt" | "updatedAt">;




export type EventStatus = "upcoming" | "ongoing" | "past";

export interface Event {
  _id: string;
  title: string;
  date: string;
  endDate?: string;
  timeDisplay?: string;
  location: string;
  audience: string[];
  description: string;
  longDescription?: string;
  tags: string[];
  status: EventStatus;
  imageUrl?: string;
  registrationUrl?: string;
  maxAttendees?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventFormData = Omit<Event, "_id" | "isActive" | "createdAt" | "updatedAt">;




export type PartnerTier = "platinum" | "gold" | "silver" | "partner";

export interface Partner {
  _id: string;
  name: string;
  logoUrl?: string;
  logoText?: string;
  website?: string;
  tier: PartnerTier;
  order?: number;
  isActive: boolean;
}




export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
