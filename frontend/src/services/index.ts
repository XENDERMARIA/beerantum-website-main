import api from "./api";
import type {
  ApiResponse, User, TeamMember, TeamMemberFormData,
  Event, EventFormData, Partner, Contact, ContactFormData,
} from "@/types";




export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>("/auth/login", { email, password }),

  logout: () => api.post("/auth/logout"),

  getMe: () => api.get<ApiResponse<User>>("/auth/me"),

  refreshToken: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/refresh", { refreshToken }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),

  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/auth/register", data),
};




export const teamService = {
  getAll: () => api.get<ApiResponse<TeamMember[]>>("/team"),
  getOne: (id: string) => api.get<ApiResponse<TeamMember>>(`/team/${id}`),
  create: (data: TeamMemberFormData) => api.post<ApiResponse<TeamMember>>("/team", data),
  update: (id: string, data: Partial<TeamMemberFormData>) =>
    api.put<ApiResponse<TeamMember>>(`/team/${id}`, data),
  remove: (id: string) => api.delete(`/team/${id}`),
};




export const eventsService = {
  getAll: (status?: string) =>
    api.get<ApiResponse<Event[]>>("/events", { params: status ? { status } : {} }),
  getOne: (id: string) => api.get<ApiResponse<Event>>(`/events/${id}`),
  create: (data: EventFormData) => api.post<ApiResponse<Event>>("/events", data),
  update: (id: string, data: Partial<EventFormData>) =>
    api.put<ApiResponse<Event>>(`/events/${id}`, data),
  remove: (id: string) => api.delete(`/events/${id}`),
};




export const partnersService = {
  getAll: () => api.get<ApiResponse<Partner[]>>("/partners"),
  create: (data: Omit<Partner, "_id" | "isActive">) => api.post<ApiResponse<Partner>>("/partners", data),
  update: (id: string, data: Partial<Partner>) => api.put<ApiResponse<Partner>>(`/partners/${id}`, data),
  remove: (id: string) => api.delete(`/partners/${id}`),
};




export const contactService = {
  submit: (data: ContactFormData) => api.post<ApiResponse<{ id: string }>>("/contact", data),
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<ApiResponse<Contact[]>>("/contact", { params }),
  updateStatus: (id: string, status: string, adminNotes?: string) =>
    api.patch(`/contact/${id}/status`, { status, adminNotes }),
  remove: (id: string) => api.delete(`/contact/${id}`),
};




export const contentService = {
  getAll: () => api.get<ApiResponse<Record<string, unknown>>>("/content"),
  getByKey: (key: string) => api.get<ApiResponse<{ data: unknown }>>(`/content/${key}`),
  upsert: (key: string, section: string, data: unknown) =>
    api.put(`/content/${key}`, { section, data }),
};
