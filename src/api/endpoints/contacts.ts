import { apiClient } from "../client";

export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
}

export const contactsApi = {
  submit: (payload: CreateContactPayload) => apiClient.post("/contacts", payload).then((r) => r.data),
};
